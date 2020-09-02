AFRAME.registerComponent("wasd-ext", {
  dependencies: ["wasd-controls"],

  schema: {
    rotate: {
      default: 0.001,
    },
    avatar: {
      type: "selector",
      default: "#avatar",
    },
  },

  rotate: 0,
  camUp: false,

  play() {
    window.addEventListener("keydown", this.onKeyDown.bind(this))
    window.addEventListener("keyup", this.onKeyUp.bind(this))
  },

  pause() {
    window.removeEventListener("keydown", this.onKeyDown)
    window.removeEventListener("keyup", this.onKeyUp)
  },

  onKeyDown({ key }: KeyboardEvent) {
    if (key === "q") {
      this.rotate = 1
    } else if (key === "e") {
      this.rotate = -1
    } else if (key === "c") {
      this.camUp = !this.camUp
      this.el.sceneEl.camera.el.emit(this.camUp ? "u" : "d")
      setTimeout(() => this.data.avarar.setAttribute("visible", this.camUp), 200)
    }
  },

  onKeyUp({ key }: KeyboardEvent) {
    if (key === "q" || key === "e") {
      this.rotate = 0
    }
  },

  tick(_, timeDelta: number) {
    if (this.rotate !== 0) {
      this.el.object3D.rotation.y += this.data.rotate * this.rotate * timeDelta
    }
  },
})
