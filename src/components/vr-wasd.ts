AFRAME.registerComponent("vr-wasd", {
  schema: {
    acceleration: { default: 200 },
  },
  init() {
    this.rig = document.querySelector("#rig")
    if (this.rig.hasLoaded) {
      this.addControls()
    } else {
      this.rig.addEventListener("loaded", this.addControls.bind(this), { once: true })
    }
  },

  //TODO: fix with gameplay
  addControls() {
    this.el.addEventListener("axismove", e => {
      const [axisX, axisY] = e.detail.axis
      const [changedX, changedY] = e.detail.changed
      this.rig.components["wasd-controls"].data.acceleration = this.data.acceleration * Math.abs(axisY || axisX)
      // console.log("a", [axisX, axisY, axisX || axisY])

      if (changedX) {
        if (axisX === 0) {
          window.dispatchEvent(new KeyboardEvent("keyup", { code: this.lastX }))
        } else {
          let code = axisX < 0 ? "KeyA" : "KeyD"
          if (this.lastX !== code) {
            window.dispatchEvent(new KeyboardEvent("keyup", { code: this.lastX }))
          }
          window.dispatchEvent(new KeyboardEvent("keydown", { code }))
          this.lastX = code
        }
      }
      if (changedY) {
        if (axisY === 0) {
          window.dispatchEvent(new KeyboardEvent("keyup", { code: this.lastY }))
        } else {
          let code = axisY < 0 ? "KeyW" : "KeyS"
          if (this.lastY !== code) {
            window.dispatchEvent(new KeyboardEvent("keyup", { code: this.lastY }))
          }
          window.dispatchEvent(new KeyboardEvent("keydown", { code }))
          this.lastY = code
        }
      }
    })
  },
})
