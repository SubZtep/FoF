AFRAME.registerComponent("wasd-ext", {
  dependencies: ["wasd-controls", "raycaster"],

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

  init() {
    this.el.sceneEl.addEventListener("enter-vr", this.pause.bind(this))
    this.el.sceneEl.addEventListener("exit-vr", this.play.bind(this))
  },

  play() {
    window.addEventListener("keydown", this.onKeyDown.bind(this))
    window.addEventListener("keyup", this.onKeyUp.bind(this))
  },

  pause() {
    window.removeEventListener("keydown", this.onKeyDown)
    window.removeEventListener("keyup", this.onKeyUp)
    this.cam(false)
  },

  cam(up: boolean) {
    this.el.sceneEl.camera.el.emit(up ? "u" : "d")
    setTimeout(() => {
      this.data.avatar.setAttribute("visible", up)
      this.el.setAttribute("raycaster", "showLine", up)
    }, 200)
  },

  onKeyDown({ key }: KeyboardEvent) {
    if (key === "q") {
      this.rotate = 1
    } else if (key === "e") {
      this.rotate = -1
    } else if (key === "c") {
      this.camUp = !this.camUp
      this.cam(this.camUp)
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
