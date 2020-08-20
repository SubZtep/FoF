import Sound from "./Sound"
import synth from "./synth.json"
import { SynthStore, Sounds } from "./audio.d"

let audioContext = new AudioContext()

const loadSound = (name: string, ctx?: BaseAudioContext) => {
  const obj: SynthStore = synth[name]

  const s = new Sound(ctx ?? audioContext)

  obj.analysers.forEach(node => s.setAnalyser(node))
  obj.gains.forEach(node => s.setGain(node))
  obj.biquadFilters.forEach(node => s.setBiquadFilter(node))
  obj.oscillators.forEach(node => s.setOscillator(node))

  return s
}

export const loadBeat = () => {
  const sequence: Sounds = synth.sequencer

  const stepsPerBar = sequence.notesPerBeat * sequence.beatsPerBar
  const bps = sequence.BPM / 60
  const stepsPerBeat = stepsPerBar / 2 // / 4
  let lengthOfStep = bps / stepsPerBeat

  Object.values(sequence.bars).forEach(bar => {
    const sound = loadSound(bar.soundName, audioContext)
    if (sound !== null) {
      bar.steps.forEach((step, index) => {
        if (step !== null) {
          sound.play(step, lengthOfStep * (index + 1))
        }
      })
    }
  })
}

export const getAudioBuffer = async () => {
  const offlineCtx = new OfflineAudioContext(
    2,
    audioContext.sampleRate * 30,
    audioContext.sampleRate
  )

  const sequence: Sounds = synth.sequencer

  const stepsPerBar = sequence.notesPerBeat * sequence.beatsPerBar
  const bps = sequence.BPM / 60
  const stepsPerBeat = stepsPerBar / 2 // / 4
  let lengthOfStep = bps / stepsPerBeat

  Object.values(sequence.bars).forEach(bar => {
    const sound = loadSound(bar.soundName, offlineCtx)
    if (sound !== null) {
      bar.steps.forEach((step, index) => {
        if (step !== null) {
          sound.play(step, lengthOfStep * (index + 1))
        }
      })
    }
  })

  const buffer = await offlineCtx.startRendering()
  return buffer
}
