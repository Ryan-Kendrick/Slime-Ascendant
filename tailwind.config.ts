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
        purpleTop: "#631F9A",
        purpleMid: "#541B84",
        purpleBottom: "#38136D",
        purpleTopSm: "#531A83",
        purpleMidSm: "#441677",
        purpleBottomSm: "#35126B",
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
        "85": ".85",
        "80": ".80",
      },
      backgroundColor: {
        cogColor: "#DFDBE5",
      },
      backgroundImage: {
        meadow: "url('/assets/icons/meadow.jpg')",
      },
      boxShadow: {
        upgrade:
          "inset 5px 5px 13px #fb923c, inset -5px -5px 13px #2e1065, -5px -5px 5px rgb(251 146 60), 3px 5px 25px #2e1065",
        panel: "inset 5px 5px 13px #fb923c, inset -5px -5px 13px #2e1065",
        "panel-t-1": "inset 0 5px 13px #fb923c",
        "panel-t-2": "inset 0 5px 13px #2e1065",
        "panel-xb": "inset 5px 0 13px #fb923c, inset -5px 0 13px #2e1065, inset 0 -5px 13px #2e1065",
      },
      borderRadius: {
        nm: "61px",
      },
      gradientColorStops: {
        nm: "linear-gradient(145deg, orange, purple)",
      },
    },
  },
  plugins: [],
} satisfies Config
