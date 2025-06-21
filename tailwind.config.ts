import defaultTheme from "tailwindcss/defaultTheme"
import type { Config } from "tailwindcss"

export default {
  content: ["./{pages,layouts,components,src}/**/*.{html,js,jsx,ts,tsx,vue}"],
  safelist: [
    "bg-orange-200/50",
    "bg-red-300/50",
    "bg-green-300/50",
    "bg-electricblue/50",
    "before:bg-[url('/assets/icons/adventurerBg.svg')]",
    "before:bg-[url('/assets/icons/warriorBg.svg')]",
    "before:bg-[url('/assets/icons/healerBg.svg')]",
    "before:bg-[url('/assets/icons/mageBg.svg')]",
  ],
  theme: {
    extend: {
      animation: {
        "bounce-fade": "bounceFade 1.5s ease-out forwards",
        "float-up": "floatUp 2s ease-out forwards",
        "multistrike-slash": "slash 0.8s ease-out",
        "multistrike-ring": "multistrike-ring 1s cubic-bezier(.63,-1.02,0,.85) forwards",
        "multistrike-simple-1": "daggerAppear .800s ease-out forwards",
        "multistrike-simple-2": "daggerAppear .533s ease-out .266s forwards",
        "multistrike-simple-3": "daggerAppear .266s ease-out .533s forwards",
      },
      keyframes: {
        floatUp: {
          "0%": { transform: "translateY(0) scale(0.7)", opacity: "0" },
          "10%": { transform: "translateY(-20px) scale(1.2)", opacity: "1" },
          "100%": { transform: "translateY(-80px) scale(0.6)", opacity: "0" },
        },
        "multistrike-ring": {
          "0%": { transform: "translate(-50%, -50%) scale(0)", opacity: "1" },
          "8%": { opacity: "0.8" },
          "15%": { transform: "translate(-50%, -50%) scale(2)", opacity: "0.8" },
          "30%": { transform: "translate(-50%, -50%) scale(4)", opacity: "0" },

          "30.1%": { transform: "translate(-50%, -50%) scale(2)", opacity: "0.8" },
          "38%": { opacity: "0.8" },
          "50%": { transform: "translate(-50%, -50%) scale(4)", opacity: "0" },

          "50.1%": { transform: "translate(-50%, -50%) scale(2)", opacity: "0.8" },
          "58%": { opacity: "0.8" },
          "70%": { transform: "translate(-50%, -50%) scale(4)", opacity: "0" },

          "100%": { transform: "translate(-50%, -50%) scale(3)", opacity: "0" },
        },
        daggerAppear: {
          "0%": {
            opacity: "0",
          },
          "20%": {
            opacity: "1",
          },
          "60%": {
            opacity: "1",
          },
          "100%": {
            opacity: "0",
          },
        },
      },
      colors: {
        purpleOrange: "#631E54",
        electricBlue: "#7DF9FF",
        electricGreenLight: "#deffdb",
        electricGreen: "#21fc0d",
        islam: "#009000",
        hpgreen: "#00BB27",
        darkgreen: "#11772D",
        gold: "#ffbf00",
        lightgold: "#ffcf40",
        darkgold: "#cca533",
      },
      fontFamily: {
        arial: ["Arial", "sans-serif"],
        sans: [...defaultTheme.fontFamily.sans],
        sigmar: ["Sigmar", "system-ui", "sans-serif"],
        paytone: ["Paytone", "system-ui", "sans-serif"],
        passion: ["Passion", "system-ui", "sans-serif"],
      },
      cursor: {
        active: "url('/assets/icons/hand.webp') 0 0, pointer",
        inactive: "url('/assets/icons/hand-dark.webp') 0 0, pointer",
        dagger: "url('/assets/icons/dagger.png') 0 0, pointer",
      },
      scale: {
        "130": "1.30",
        "120": "1.20",
        "115": "1.15",
        "85": ".85",
        "80": ".80",
      },
      backgroundColor: {
        cogColor: "#DFDBE5",
      },
      backgroundImage: {
        dagger: "url('/assets/icons/dagger.png')",
        gold: "linear-gradient(135deg, #b8860b, #daa520, #cd853f)",
        meadow: "url('/assets/icons/meadow.jpg')",
        chainsLeft: "url('/assets/icons/chains-left.webp')",
        chainsRight: "url('/assets/icons/chains-right.webp')",
        chainsLeftPartial: "url('/assets/icons/chains-left-partial.webp')",
        chainsRightPartial: "url('/assets/icons/chains-right-partial.webp')",
        chainsLeftBottom: "url('/assets/icons/chains-left-bottom.webp')",
        chainsRightBottom: "url('/assets/icons/chains-right-bottom.webp')",
      },
      boxShadow: {
        upgrade:
          "inset 5px 5px 13px #fb923c, inset -5px -5px 13px #2e1065, -5px -5px 5px rgb(251 146 60), 3px 5px 25px #2e1065",
        panel: "inset 5px 5px 13px #fb923c, inset -5px -3px 13px #2e1065",
        "panel-t-1":
          "inset 0 2px 6px rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(139, 69, 19, 0.3), inset 0 0 8px rgba(184, 134, 11, 0.15)",
        "panel-main": `inset 1px -2px 9px #fa7305, 
        inset 2px -2px 9px #800000, 
        inset 2px -3px 9px #2e1065`,
      },
      borderRadius: {
        m: "61px",
      },
      gradientColorStops: {
        nm: "linear-gradient(145deg, orange, purple)",
      },
    },
  },
  plugins: [],
} satisfies Config
