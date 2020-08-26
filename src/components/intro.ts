import { loadEntity } from "../utils"

AFRAME.registerComponent("intro", {
  async init() {
    await loadEntity("intro", this.el)
    this.el.setAttribute("background", "color: #000")
    this.end = 0
    ;["l", "r"].forEach(h => {
      let c = document.querySelector(`#${h}`)
      c.addEventListener("thumbstickdown", () => {
        this.end++

        //- Press both thumbstick to continue
        if (this.end === 2) {
          this.el.setAttribute(
            "animation",
            "property: background.color; type: color; to: #24b5af; easing: easeInOutQuint; dur: 10000"
          )
          setTimeout(() => {
            document.querySelectorAll(".intro").forEach(el => void el.parentNode.removeChild(el))
          }, 5000)

          this.el.sceneEl.addState("forest")
        }
      })
      c.addEventListener("thumbstickup", () => {
        this.end--
      })
    })
  },

  remove() {
    // this.el.removeAttribute("animation")
    document.querySelectorAll(".intro").forEach(el => void el.parentNode.removeChild(el))
    this.el.setAttribute("background", "color: #24b5af")
  },
})
