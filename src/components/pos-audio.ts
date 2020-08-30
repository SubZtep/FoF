import { DetailEvent } from "aframe"

AFRAME.registerComponent("pos-audio", {
  init() {
    this.el.sceneEl.addEventListener("audio-listener-active", this.setup.bind(this))
  },

  setup({ detail: listener }: DetailEvent<THREE.AudioListener>) {
    const audio = new THREE.PositionalAudio(listener)
    // audio.setVolume(0.1)
    this.el.posAudio = audio
    this.el.emit("pos-audio-active", audio)
  },
})
