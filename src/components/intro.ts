import { getEntity } from "../utils"

AFRAME.registerComponent("intro", {
  async init() {
    let els = await getEntity("intro", this.el)

    els.forEach(el => void this.el.appendChild(el))
    this.el.setAttribute("background", "color: #000")
    this.el.setAttribute(
      "animation",
      "property: background.color; type: color; to: #24b5af; easing: easeInOutQuint; delay: 5000; dur: 10000"
    )
  },

  remove() {
    this.el.removeAttribute("animation")
    document.querySelectorAll(".intro").forEach(el => void el.parentNode.removeChild(el))
  },
})
