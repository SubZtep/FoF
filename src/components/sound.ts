import { getAudioBuffer } from "../audio/audio"

Object.defineProperty(AFRAME.components.sound.Component.prototype, "audioLoader", {
  value: {
    load: async (src: string, onLoad: (audioBuffer: AudioBuffer) => void) => {
      onLoad(await getAudioBuffer())
    },
  },
})
