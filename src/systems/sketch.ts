import { addMixin, delMixin } from "../utils"

/**
 * Various tests and sketches during development
 */
AFRAME.registerSystem("sketch", {
  schema: {
    box: {
      type: "selector",
      default: ".box",
    },
  },

  init() {
    // addMixin(this.data.box)("blackbox", "bigbox")
    // setTimeout(() => {
    //   delMixin(this.data.box)("blackbox")
    // }, 1000)
  },
})
