AFRAME.registerSystem("colours", {
  schema: {
    theme: {
      default: "tomi",
    },
    ground: {
      type: "selector",
      default: ".ground",
    },
  },

  // init() {
  //   this.el.addEventListener("loaded", this.update.bind(this), { once: true })
  // },

  // update() {
  //   let { el, data } = this
  //   if (el.hasLoaded && data.theme === "tomi") {
  //     let color = 0x303c42
  //     el.setAttribute("background", { color })
  //     el.setAttribute("fog", { color })
  //     data.ground.setAttribute("gmat", { color: 0x499d45, color2: 0x000000 })
  //     // data.ground.setAttribute("gmat", { color: 0x836a14, color2: 0x006600 })
  //   }
  // },
})
