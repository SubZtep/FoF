/**
 * ADD TO THE PLAYER OBJECT WITH CAMERA
 *
 * Add extra keyboard movement keys for `wasd-controls` component:
 * q,Q: turn left
 * e,E: turn right
 * c: toggle 1st and 3rd person camera with visible raycaster vector for obstacle detection
 */
AFRAME.registerComponent("wasd-ext", {
  dependencies: ["wasd-controls"],

  schema: {
    turn: { default: 0.001 },
    avatar: { type: "selector", default: "#avatar" },
    playerCam: { type: "selector", default: ".camera" },
    enabled: { default: true },
  },

  t: 0, // for timeout
  turn: 0, // current turn speed
  camUp: false, // 3rd person avatar view
  doRot: true, // slice rotation for vr

  play() {
    window.addEventListener("keydown", this.onKeyDown.bind(this))
    window.addEventListener("keyup", this.onKeyUp.bind(this))
    this.el.sceneEl.addEventListener("enter-vr", this.toVR.bind(this))
    this.el.sceneEl.addEventListener("exit-vr", this.exVR.bind(this))
  },

  pause() {
    clearTimeout(this.t)
    window.removeEventListener("keydown", this.onKeyDown)
    window.removeEventListener("keyup", this.onKeyUp)
    this.el.sceneEl.removeEventListener("enter-vr", this.toVR)
    this.el.sceneEl.removeEventListener("exit-vr", this.exVR)
  },

  toVR() {
    this.data.playerCam.object3D.children[0].el.emit("enter-vr", null, false)
  },

  exVR() {
    this.data.playerCam.object3D.children[0].el.emit("exit-vr", null, false)
  },

  cam(up: boolean) {
    this.data.playerCam.object3D.el.emit(up ? "u" : "d")
    this.t = setTimeout(() => {
      this.data.avatar.setAttribute("visible", up)
      this.el.children[0]?.setAttribute("raycaster", "showLine", up)
    }, 200)
  },

  onKeyDown({ key }: KeyboardEvent) {
    if (!this.data.enabled) return
    if (["q", "e"].includes(key)) {
      this.turn = key === "q" ? 1 : -1
    } else if (["Q", "E"].includes(key) && this.dorot) {
      let ang = Math.PI / 5
      if (key === "E") ang *= -1
      this.el.object3D.rotation.y += ang
      this.dorot = false
    } else if (key === "c") {
      this.camUp = !this.camUp
      this.cam(this.camUp)
    }
  },

  onKeyUp({ key }: KeyboardEvent) {
    if (["q", "e"].includes(key)) {
      this.turn = 0
    } else if (["Q", "E"].includes(key)) {
      this.dorot = true
    }
  },

  tick(_, timeDelta: number) {
    if (this.data.enabled) this.el.object3D.rotation.y += this.data.turn * this.turn * timeDelta
  },

  update({ enabled }) {
    let { el, data } = this

    if (data.enabled !== enabled && el.components["wasd-controls"]) {
      el.setAttribute("wasd-controls", "enabled", enabled)
      if (!enabled) this.turn = 0
    }
  },
})
