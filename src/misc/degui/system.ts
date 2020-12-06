import dat from "dat.gui"

AFRAME.registerSystem<{ gui?: dat.GUI }>("degui", {
  init() {
    // @ts-ignore
    Object.defineProperty(dat.controllers.Controller.prototype, "title", {
      value: function (description: string) {
        this.domElement.closest(".cr").setAttribute("title", description)
        return this
      },
    })

    this.gui = new dat.GUI({ width: 350 })
  },
})
