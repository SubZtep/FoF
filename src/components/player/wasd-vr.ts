/**
 * VR controller movement using "wasd-control" component by faking pressed keys
 *
 * Entity state: run, hold, exe
 */
import { DetailEvent, Entity } from "aframe"
import { AxisDetail, ButtonDetail, Hand, InputMapping, EmulatedKeys, ControllerMap } from "../../types"

AFRAME.registerComponent("wasd-vr", {
  schema: {
    action: {
      default: "move",
      // oneOf: ["move", "turn"],
    },
    acceleration: {
      // type: "number",
      default: 65,
    },
    run: {
      // type: "number",
      default: 2, // multiplier
    },
    turn: {
      // type: "number",
      // default: Math.PI / 5,
      default: 0.005,
    },
    target: {
      type: "selector",
      // default: "#player",
    },
  },

  update(oldData) {
    let { el, data } = this

    if (data.target !== oldData.target) {
      el.addEventListener("stateadded", ({ detail }) => {
        if (detail === "connected") {
          if (data.target.hasLoaded) {
            this.addControls()
          } else {
            data.target.addEventListener("loaded", this.addControls.bind(this), { once: true })
          }
        }
      })
      el.addEventListener("stateremoved", ({ detail }) => {
        if (detail === "run" && data.action === "turn" && this.ext) {
          this.ext.turn = 0
        }
      })
      el.addEventListener("controllerconnected", () => el.addState("connected"))
      el.addEventListener("controllerdisconnected", () => el.removeState("connected"))
    }
  },

  move(x: number, y: number) {
    if (!this.wasd) return

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
      Math.max(Math.abs(y), Math.abs(x)) * (this.data.acceleration * (this.el.is("run") ? this.data.run : 1))
    this.wasd.keys = keys
  },

  turn(x: number) {
    if (!this.ext) return

    if (x === 0) {
      this.ext.turn = 0
      window.dispatchEvent(new KeyboardEvent("keyup", { key: "Q" }))
    } else if (this.el.is("run")) {
      this.ext.turn = -x
    } else {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: x < 0 ? "Q" : "E" }))
    }
  },

  addControls() {
    let { el, data } = this

    data.target.setAttribute("wasd-ext", "turn", data.turn)
    data.target.setAttribute("wasd-controls", "acceleration", data.acceleration)
    this.wasd = data.target.components["wasd-controls"]
    this.ext = data.target.components["wasd-ext"]

    // console.log(data.target.hasLoaded)
    // console.log([this.wasd, this.wasd.el, this.wasd.el.hasLoaded])

    el.addEventListener("buttonchanged", ({ detail }: DetailEvent<ButtonDetail>) => {
      let fn = detail.state.pressed ? "addState" : "removeState"
      let button = this.mapping().buttons[detail.id]
      switch (button) {
        case "thumbstick": {
          el[fn]("run")
          break
        }
        case "grip": {
          el[fn]("hold")
          break
        }
        case "trigger": {
          el[fn]("exe")
          el.object3D.userData.exe = detail.state
          break
        }
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

  mapping(): ControllerMap {
    let { id, hand } = this.el.components["tracked-controls"].data as { id: number; hand: Hand }
    let mapping: InputMapping = this.el.components[`${id}-controls`].mapping
    return mapping[hand]
  },
})
