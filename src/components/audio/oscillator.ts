import { DetailEvent } from "aframe"

AFRAME.registerComponent("oscillator", {
  dependencies: ["pos-audio"],

  multiple: true,

  schema: {
    frequency: {
      type: "number",
      default: 440,
    },
    detune: {
      type: "number",
      default: 0,
    },
    type: {
      default: "sine",
    },
    playSound: {
      default: false,
    },
  },

  init() {
    let el = this.el
    el.addEventListener("pos-audio-active", this.setup.bind(this))
    el.addEventListener("stateadded", ({ detail }: DetailEvent<string>) => {
      if (detail === "exe") {
        this.start()
      }
    })
    el.addEventListener("stateremoved", ({ detail }: DetailEvent<string>) => {
      if (detail === "exe") {
        this.stop()
      }
    })
  },

  setup({ detail }: DetailEvent<THREE.PositionalAudio>) {
    this.audio = detail
  },

  start() {
    if (!this.audio) return
    this.oscillator = this.audio.context.createOscillator()
    this.oscillator.frequency.setValueAtTime(this.data.frequency, 0)
    this.oscillator.detune.setValueAtTime(this.data.detune, 0)
    this.audio.setNodeSource(this.oscillator)
    this.oscillator.start()
  },

  stop() {
    this.oscillator?.stop()
    this.oscillator?.disconnect()
  },
})
