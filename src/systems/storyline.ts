import { loadEntity } from "../utils"

AFRAME.registerSystem("storyline", {
  init() {
    // this.storyIntro()

    this.el.addEventListener(
      "enter-vr",
      async () => {
        console.log("ENTER VR")
        await loadEntity("controllers", document.querySelector("#rig"))
      },
      { once: true }
    )

    this.el.addEventListener("exit-vr", () => {
      console.log("EXIT VR")
    })
  },

  storyIntro() {
    this.el.setAttribute("intro", "")
    setTimeout(() => this.el.removeAttribute("intro"), 2000)
  },
})
