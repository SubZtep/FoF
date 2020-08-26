AFRAME.registerComponent("grounder", {
  dependencies: ["position"],

  init() {
    // console.log("AAA", [this.el.id, this.el.object3D.position])

    let worker = this.el.sceneEl.systems.ground.worker

    worker.addEventListener("message", (msg: MessageEvent) => {
      const { id, pos } = msg.data
      if (id === this.el.id) {
        this.el.object3D.position.set(...pos)
        this.el.object3D.visible = true
      }
    })

    worker.postMessage({
      cmd: "q",
      payload: {
        id: this.el.id,
        pos: this.el.object3D.position,
      },
    })
  },
})
