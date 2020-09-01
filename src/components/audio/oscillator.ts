import { DetailEvent } from "aframe"

AFRAME.registerComponent("oscillator", {
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
  },

  init() {
    this.el.addEventListener("pos-audio-active", this.setup.bind(this))
  },

  setup({ detail: audio }: DetailEvent<THREE.PositionalAudio>) {
    this.oscillator = audio.context.createOscillator()
    this.oscillator.frequency.setValueAtTime(this.data.frequency, 0)
    audio.setNodeSource(this.oscillator)
    this.oscillator.start()
  },

  remove() {
    this.oscillator?.disconnect()
  },

  pause() {
    console.log("PAUSEEE")
  },
})
