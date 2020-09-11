import { Vector2 } from "super-three/src/math/Vector2"

/**
 * Add extra keyboard movement keys for `wasd-controls` component:
 * q,Q: turn left
 * e,E: turn right
 * c: toggle 1st and 3rd person camera with visible raycaster vector for obstacle detection
 */
AFRAME.registerComponent("wasd-ext", {
  dependencies: ["wasd-controls"],

  schema: {
    turn: {
      default: 0.001,
      // default: Math.PI / 5,
    },
    avatar: {
      type: "selector",
      default: "#avatar",
    },
  },

  turn: 0,
  camUp: false,
  dorot: true,

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
      this.el.children[0]?.setAttribute("raycaster", "showLine", up)
    }, 200)
  },

  onKeyDown({ key }: KeyboardEvent) {
    if (key === "q") {
      this.turn = 1
    } else if (key === "e") {
      this.turn = -1
    } else if (key === "Q" && this.dorot) {
      this.el.object3D.rotation.y += Math.PI / 5
      this.dorot = false
    } else if (key === "E" && this.dorot) {
      this.el.object3D.rotation.y -= Math.PI / 5
      this.dorot = false
    } else if (key === "c") {
      this.camUp = !this.camUp
      this.cam(this.camUp)
    }
    // if (this.turn !== 0) {
    //   this.el.object3D.rotation.y += this.data.turn * this.turn
    //   this.turn = 0
    // }
  },

  onKeyUp({ key }: KeyboardEvent) {
    if (key === "q" || key === "e") {
      this.turn = 0
    } else if (key === "Q" || key === "E") {
      this.dorot = true
    }
  },

  tick(_, timeDelta: number) {
    this.el.object3D.rotation.y += this.data.turn * this.turn * timeDelta
    // if (this.turn !== 0) {
    //   // this.el.object3D.rotation.y += this.data.turn * this.turn
    //   // this.turn = 0
    // }
  },

  // canMove(pos: Vector2) {
  //   let { borderTL, borderBR } = this.data
  //   if (
  //     (borderTL.x === 0 && borderTL.y === 0 && borderBR.x === 0 && borderBR.y === 0) ||
  //     (borderTL.x > pos.x && borderTL.y > pos.y && borderBR.x < pos.x && borderBR.y < pos.y)
  //   )
  //     return true
  //   return false
  // },
})
