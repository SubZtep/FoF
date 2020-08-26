import { getEntity } from "../utils"

AFRAME.registerSystem("storyline", {
  init() {
    // this.storyIntro()

    this.el.addEventListener("enter-vr", async () => {
      console.log("ENTER VR")
      // await getEntity("controllers", this.el)
    })

    this.el.addEventListener("exit-vr", () => {
      console.log("EXIT VR")
    })
  },

  storyIntro() {
    this.el.setAttribute("intro", "")
    setTimeout(() => this.el.removeAttribute("intro"), 2000)
  },
})
