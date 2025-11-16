import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr"
import {
  ChatUser,
  ConfirmedMessage,
  DisplayedMessages,
  MessageQueue,
  SystemMessage,
  UserMessage,
} from "../models/slimechat"
import { METADATA_CONFIG } from "./meta"
import { getRandomColor } from "./utils"
import React from "react"

type MessageSetter = React.Dispatch<React.SetStateAction<DisplayedMessages>>
type ChatUserSetter = React.Dispatch<React.SetStateAction<ChatUser | null>>
type ActiveUsersSetter = React.Dispatch<React.SetStateAction<ChatUser[]>>

class ChatConnection {
  private _connection: HubConnection
  private _messageRetryTime = 60000
  private _optimismTime = 6000
  private _slowConnectTimer?: NodeJS.Timeout | null
  private _reconnectTimer?: NodeJS.Timeout | null
  private _messageQueue: MessageQueue = []
  public user: ChatUser
  public RegisterEvent: {
    getActiveUsers: (userSetterFn: ActiveUsersSetter) => void
    getMessageHistory: (messageSetterFn: MessageSetter) => void
    userJoined: (messageSetterFn: MessageSetter, userSetterFn: ActiveUsersSetter) => void
    userLeft: (messageSetterFn: MessageSetter) => void
    messageReceived: (messageSetterFn: MessageSetter) => void
    serverMessage: (messageSetterFn: MessageSetter) => void
  }
  static ChatInstance: ChatConnection

  constructor(isConnectedSetterFn: (isConnected: boolean) => void, userSetterFn: ChatUserSetter) {
    this._connection = new HubConnectionBuilder()
      .withUrl(METADATA_CONFIG.chatServerUrl)
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build()
    this.user = this.createDefaultUser()
    userSetterFn(this.user)
    this.connect(isConnectedSetterFn)

    this.RegisterEvent = {
      getActiveUsers: (userSetterFn) => {
        this._connection.on("GetActiveUsers", (activeUsers: ChatUser[]) => {
          userSetterFn(activeUsers)
        })
      },
      getMessageHistory: (messageSetterFn) => {
        this._connection.on("GetMessageHistory", (messageHistory: ConfirmedMessage[]) => {
          messageSetterFn(messageHistory)
        })
      },
      userJoined: (messageSetterFn, userSetterFn) => {
        this._connection.on("UserJoined", (userJoinedMessage: SystemMessage, joinedUser: ChatUser) => {
          messageSetterFn((prev) => [...prev, userJoinedMessage])
          userSetterFn((users) => [...users, joinedUser])
        })
      },
      userLeft: (messageSetterFn) => {
        this._connection.on("UserLeft", (userLeftMessage: SystemMessage) => {
          messageSetterFn((messageHistory) => [...messageHistory, userLeftMessage])
        })
        // Server will invoke GetActiveUsers
      },
      messageReceived: (messageSetterFn) => {
        this._connection.on("MessageReceived", (incomingMessage: ConfirmedMessage) => {
          messageSetterFn((messageHistory) => [...messageHistory, incomingMessage])
        })
      },
      serverMessage: (messageSetterFn) => {
        this._connection.on("ServerMessage", (incomingMessage: ConfirmedMessage) => {
          messageSetterFn((messageHistory) => [...messageHistory, incomingMessage])
        })
      },
    }
  }

  private createDefaultUser(): ChatUser {
    const name = `Slime-${Math.floor(Math.random() * 1000)}`
    const color = getRandomColor()
    const id = `${name}.${Date.now()}`

    this.user = {
      name,
      color,
      id,
    } as ChatUser

    return this.user
  }

  private async connect(isConnectedSetterFn: (isConnected: boolean) => void): Promise<void> {
    if (this._connection.state !== "Disconnected") {
      console.error("Connect chat called but the chat state is not currently 'Disconnected'")
      return
    }

    if (this._slowConnectTimer) {
      clearTimeout(this._slowConnectTimer)
      this._slowConnectTimer = undefined
    }
    if (this._reconnectTimer) {
      clearTimeout(this._reconnectTimer)
      this._reconnectTimer = undefined
    }

    try {
      console.log("Connecting to chat...")
      this._slowConnectTimer = setTimeout(() => {
        if (this._connection && this._connection.state !== "Connected") {
          console.warn(
            "Server response taking longer than expected, might be a cold start. Displaying reconnecting message",
          )
          isConnectedSetterFn(false)
        }
      }, this._optimismTime)

      console.log("Starting connection at", new Date().toISOString(), "state:", this._connection?.state)
      await this._connection.start()

      if (this._slowConnectTimer) {
        clearTimeout(this._slowConnectTimer)
        this._slowConnectTimer = null
      }

      isConnectedSetterFn(true)
      this._connection.invoke("JoinChat", this.user).catch((err) => {
        console.error("Error notifying server of user joined chat:", err)
      })
      this.onConnectTasks()
    } catch (err) {
      console.error("Failted to connect to chat:", err)
      isConnectedSetterFn(false)

      if (this._slowConnectTimer) {
        clearTimeout(this._slowConnectTimer)
        this._slowConnectTimer = undefined
      }

      this._reconnectTimer = setTimeout(() => {
        this.connect(isConnectedSetterFn)
      }, 5000)
    }
  }

  private onConnectTasks() {
    this.flushMessageQueue()
  }

  private flushMessageQueue() {
    const now = Date.now()
    const messagesToSend = this._messageQueue.filter((item) => now - item.createdAt <= this._messageRetryTime)

    messagesToSend.forEach((item) => {
      ChatConnection.ChatInstance._connection.invoke("BroadcastMessage", item.message).catch((error) => {
        console.error("Error sending queued message:", error)
      })
    })

    this._messageQueue = []
  }

  public sendMessage(newMessage: string, messageSetterFn: MessageSetter) {
    const messageData = {
      name: this.user.name,
      content: newMessage,
      type: "user",
      unixTime: Date.now(),
      color: this.user.color,
    } as UserMessage

    messageSetterFn((prevMessages) => [...prevMessages, messageData])

    // Send the message if connected to chat, otherwise add to message queue
    if (this._connection.state === "Connected") {
      this._connection.invoke("BroadcastMessage", messageData).catch((error) => {
        console.error("Error sending message:", error)
      })
    } else {
      this._messageQueue.push({ message: messageData, createdAt: Date.now() })
    }
  }

  public static cleanupInstance() {
    if (!this.ChatInstance) {
      console.warn("No ChatInstance to clean up.")
      return
    }

    const eventMap: { [key: string]: string } = {
      getActiveUsers: "GetActiveUsers",
      getMessageHistory: "GetMessageHistory",
      userJoined: "UserJoined",
      userLeft: "UserLeft",
      messageReceived: "MessageReceived",
      serverMessage: "ServerMessage",
    }

    const eventHandlers = Object.keys(this.ChatInstance.RegisterEvent)
    for (const handler of eventHandlers) {
      const eventName = eventMap[handler]
      if (eventName) {
        this.ChatInstance._connection.off(eventName)
      }
    }
    this.ChatInstance._connection.stop().catch((err) => console.error(err))
  }

  public static getInstance(
    isConnectedSetterFn: (isConnected: boolean) => void,
    setUserInfo: ChatUserSetter,
  ): ChatConnection {
    if (!ChatConnection.ChatInstance) ChatConnection.ChatInstance = new ChatConnection(isConnectedSetterFn, setUserInfo)
    return ChatConnection.ChatInstance
  }
}

export { ChatConnection }
export default ChatConnection.getInstance
