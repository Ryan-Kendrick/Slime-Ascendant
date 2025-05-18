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
      colors: {
        purpleOrange: "#631E54",
        electricblue: "#7DF9FF",
        islam: "#009000",
        hpgreen: "#00BB27",
        darkgreen: "#11772D",
        gold: "#ffbf00",
        lightgold: "#ffcf40",
        darkgold: "#cca533",
      },
      fontFamily: {
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
        meadow: "url('/assets/icons/meadow.jpg')",
        chainsLeftPartial: "url('/assets/icons/chains-left-partial.webp')",
        chainsRightPartial: "url('/assets/icons/chains-right-partial.webp')",
        chainsLeft: "url('/assets/icons/chains-left.webp')",
        chainsRight: "url('/assets/icons/chains-right.webp')",
      },
      boxShadow: {
        upgrade:
          "inset 5px 5px 13px #fb923c, inset -5px -5px 13px #2e1065, -5px -5px 5px rgb(251 146 60), 3px 5px 25px #2e1065",
        panel: "inset 5px 5px 13px #fb923c, inset -5px -3px 13px #2e1065",
        "panel-t-1": "inset 0 5px 13px #fb923c",
        "panel-t-2": "inset 0 5px 13px #2e1065",
        "panel-main": `inset 5px -2px 13px #fa7305, 
        inset 3px -3px 13px #800000, 
        inset 2px -5px 13px #2e1065`,
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
