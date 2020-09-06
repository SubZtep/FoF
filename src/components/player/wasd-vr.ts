/**
 * VR controller movement using "wasd-control" component by faking pressed keys
 *
 * Entity state: run
 */
import { DetailEvent, Entity } from "aframe"
import { AxisDetail, ButtonDetail, Hand, InputMapping } from "../../types"

type EmulatedKeys = {
  KeyW?: number
  KeyS?: number
  KeyA?: number
  KeyD?: number
}

AFRAME.registerComponent("wasd-vr", {
  schema: {
    action: {
      default: "move",
      oneOf: ["move", "turn"],
    },
    velocity: {
      type: "number",
      default: 120,
    },
    run: {
      type: "number",
      default: 2, // multiplier
    },
    turn: {
      type: "number",
      default: Math.PI / 5,
    },
    player: {
      type: "selector",
      default: "#player",
    },
  },

  lastTurn: 0,

  init() {
    this.el.sceneEl.addEventListener("enter-vr", this.addControls.bind(this), { once: true })
  },

  move(x: number, y: number) {
    let keys: EmulatedKeys = {}

    if (y < 0) {
      keys.KeyW = 1
    } else if (y > 0) {
      keys.KeyS = 1
    }
    if (x < 0) {
      keys.KeyA = 1
    } else if (x > 0) {
      keys.KeyD = 1
    }

    this.wasd.data.acceleration =
      Math.max(Math.abs(y), Math.abs(x)) * (this.data.velocity * (this.el.is("run") ? this.data.run : 1))
    this.wasd.keys = keys
  },

  turn(x: number) {
    let sign = Math.sign(x)
    if (sign !== this.lastTurn) {
      this.lastTurn = sign
      this.data.player.object3D.rotation.y -= sign * this.data.turn
    }
  },

  addControls() {
    let el: Entity = this.el
    this.wasd = this.data.player.components["wasd-controls"]
    el.addEventListener("buttonchanged", ({ detail }: DetailEvent<ButtonDetail>) => {
      let fn = detail.state.pressed ? "addState" : "removeState"
      let button = this.mapping().buttons[detail.id]
      switch (button) {
        case "thumbstick":
          el[fn]("run")
          break
        case "grip":
          el[fn]("hold")
          break
        case "trigger":
          el[fn]("exe")
          el.object3D.userData.exe = detail.state
          break
      }
    })
    el.addEventListener("axismove", ({ detail }: DetailEvent<AxisDetail>) => {
      // @ts-ignore
      let [x, y] = Object.values(this.mapping().axes)[0]
      let { axis } = detail
      this[this.data.action](axis[x], axis[y])
    })
    el.setAttribute("raycaster", { enabled: true })
  },

  mapping() {
    let { id, hand } = this.el.components["tracked-controls"].data as { id: number; hand: Hand }
    let mapping: InputMapping = this.el.components[`${id}-controls`].mapping
    return mapping[hand]
  },
})
