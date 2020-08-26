import { EntityEventMap } from "aframe"
import { loadEntity } from "../utils"

AFRAME.registerSystem("storyline", {
  init() {
    this.el.addEventListener(
      "enter-vr",
      async () => {
        // console.log("ENTER VR")
        await loadEntity("controllers", document.querySelector("#rig"))
        this.el.addState("intro")
        // this.el.addState("forest")
      },
      { once: true }
    )

    this.el.addEventListener("exit-vr", () => {
      console.log("EXIT VR")
    })

    this.el.addEventListener("stateadded", (e: EntityEventMap["stateadded"]) => {
      switch (e.detail) {
        case "intro":
          this.el.setAttribute("intro", "")
          break
        case "forest":
          this.el.systems.ground.deploy()
          this.el.systems.forest.deploy()
          break
      }
      console.log(e.detail)
    })
  },
})
