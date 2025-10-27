import { useCallback, useEffect, useRef, useState } from "react"
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr"
import clsx from "clsx/lite"
import { ChatUser, Message, type Color } from "../../models/slimechat"
import { METADATA_CONFIG } from "../../gameconfig/meta"

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [chatFocused, setChatFocused] = useState(false)
  const [chatConnected, setChatConnected] = useState(true)
  const [user, setUser] = useState<ChatUser | null>(null)

  const mountedRef = useRef(false)
  const chatInputRef = useRef<HTMLTextAreaElement>(null)
  const connectionRef = useRef<HubConnection | null>(null)
  const reconnectRef = useRef<NodeJS.Timeout | null>(null)

  const connection = new HubConnectionBuilder()
    .withUrl(METADATA_CONFIG.chatServerUrl)
    .configureLogging(LogLevel.Information)
    .build()

  const connectChat = useCallback(async () => {
    if (!mountedRef.current) return
    if (!connectionRef.current || connectionRef.current.state !== "Disconnected") return

    try {
      console.log("Connecting to chat...")
      await connectionRef.current.start()
      setChatConnected(true)
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current)
      }
    } catch (error) {
      console.error("Failed to connect to chat:", error)
      setChatConnected(false)

      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current)
      }

      if (mountedRef.current) {
        reconnectRef.current = setTimeout(connectChat, 5000)
      }
    }
  }, [])

  const sendMessage = () => {
    if (chatInputRef.current) {
      if (!chatConnected) return

      const newMessage = chatInputRef.current.value.trim()
      if (newMessage) {
        let fallbackUser
        if (user === null) {
          const colors: Color[] = [
            "#ef4444", // red
            "#f97316", // orange
            "#f59e0b", // amber
            "#eab308", // yellow
            "#84cc16", // lime
            "#22c55e", // green
            "#10b981", // emerald
            "#14b8a6", // teal
            "#06b6d4", // cyan
            "#0ea5e9", // sky
            "#3b82f6", // blue
            "#6366f1", // indigo
            "#8b5cf6", // violet
            "#a855f7", // purple
            "#d946ef", // fuchsia
            "#ec4899", // pink
            "#f43f5e", // rose
            "#64748b", // slate
            "#78716c", // stone
          ]
          const randomColor = colors[Math.floor(Math.random() * colors.length)]
          fallbackUser = { name: `Slime-${Math.floor(Math.random() * 1000)}`, color: randomColor } as ChatUser
          setUser(fallbackUser)
        }
        const username = user?.name ?? fallbackUser!.name
        const userColor = user?.color ?? fallbackUser!.color
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            name: username,
            content: newMessage,
            unixTime: Date.now(),
            color: userColor,
          },
        ])
        chatInputRef.current.value = ""
        chatInputRef.current.focus()
        connection.send("NewMessage", user, newMessage).catch((error) => {
          console.error("Error sending message:", error)
        })
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  useEffect(() => {
    if (chatInputRef.current) {
      chatInputRef.current.focus()
      chatInputRef.current?.setSelectionRange(0, 0)
    }
    mountedRef.current = true
    setMessages([
      {
        name: "🖥️ System",
        content: "Welcome to Slime Chat!",
        unixTime: Date.now(),
      },
    ])
  }, [])

  useEffect(() => {
    // Initial connection
    if (mountedRef.current && connection.state === "Disconnected") {
      connectChat()
    }

    connection.onclose(async () => {
      if (mountedRef.current) {
        await connectChat()
      }
    })

    connection.on("ServerMessage", (incomingMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, { ...incomingMessage, unixTime: Date.now() }])
    })

    connectionRef.current = connection

    return () => {
      connection.stop()
      mountedRef.current = false
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current)
      }
      if (connectionRef.current) {
        connectionRef.current.stop()
      }
    }
  }, [])

  return (
    <div className="flex h-full gap-0.5">
      <div className="h-full w-1/3 rounded border-2 border-slate-500 bg-gradient-to-tl from-neutral-200 via-neutral-300 to-neutral-400"></div>
      <div className="flex h-full w-full flex-col justify-around">
        <h2 className="w-full text-center font-sigmar text-4xl text-green-600">Slime Chat</h2>

        {/* Chat history */}
        <div className="flex h-full w-full flex-col items-start overflow-auto px-4">
          {messages.map((message, i) => (
            <div key={i} className="flex flex-col">
              <div className="flex items-center gap-1">
                <p className="text-lg font-bold" style={{ color: message.color }}>
                  {message.name}
                </p>
                <p className="text-end text-sm text-gray-500">at {message.unixTime}</p>
              </div>
              <p className="ml-4">{message.content}</p>
            </div>
          ))}
        </div>

        <div
          className={clsx(
            "relative flex h-24 w-full items-center border-2",
            chatFocused ? "border-slate-400" : "border-slate-500",
          )}>
          {/* Error message */}
          {!chatConnected && (
            <div className="absolute -top-7 flex w-full items-center justify-center space-x-1">
              <p className="pr-2 text-red-500">Reconnecting to chat</p>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-2 w-2 animate-pulse rounded-full bg-red-400"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: "1s",
                  }}
                />
              ))}
            </div>
          )}

          {/* Chat input */}
          <textarea
            ref={chatInputRef}
            onFocus={() => setChatFocused(true)}
            onBlur={() => setChatFocused(false)}
            name="chat"
            className="h-full w-full grow resize-none overflow-auto p-1 focus:outline-none"
            onKeyDown={handleKeyDown}></textarea>
          <button
            className={clsx(
              "font-ui m-2 mr-4 flex h-12 cursor-active items-center justify-center rounded border border-slate-600 bg-slate-200 px-6 py-4 text-center font-bold text-slate-600 shadow-md",
              chatConnected ? "hover:bg-green-300" : "hover:bg-red-300",
            )}
            onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
