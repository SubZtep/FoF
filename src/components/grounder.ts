AFRAME.registerComponent("grounder", {
  init() {
    let worker = this.el.sceneEl.groundWorker
    if (!worker) return

    worker.addEventListener("message", (msg: MessageEvent) => {
      const { id, pos } = msg.data
      if (id === this.el.id) {
        this.el.object3D.position.set(...pos)
        this.el.object3D.visible = true
        this.el.object3D.updateMatrix()
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
