import Sound from "./Sound"
import synth from "./synth.json"
import { SynthStore, Sounds, Bar, StepValue } from "./audio.d"

const loadSound = (name: string, ctx: BaseAudioContext) => {
  const obj: SynthStore = synth[name]
  const s = new Sound(ctx)

  obj.analysers.forEach(node => s.setAnalyser(node))
  obj.gains.forEach(node => s.setGain(node))
  obj.biquadFilters.forEach(node => s.setBiquadFilter(node))
  obj.oscillators.forEach(node => s.setOscillator(node))

  return s
}

export const getAudioBuffer = async () => {
  let sequence: Sounds = synth.sequencer
  let stepsPerBar = sequence.notesPerBeat * sequence.beatsPerBar

  let i: number
  let j: number
  let bar: Bar
  let barId: string
  let step: StepValue
  let sound: Sound | null
  let repeat = 1
  let lengthOfStep = stepsPerBar / sequence.BPM
  let sampleRate = 44_100
  let offlineCtx = new OfflineAudioContext(1, lengthOfStep * stepsPerBar * sampleRate * repeat, sampleRate)

  for (barId in sequence.bars) {
    bar = sequence.bars[barId]
    for (j = 0; j < repeat; j++)
      for (i = 0; i < stepsPerBar; i++) {
        step = bar.steps[i]
        if (step !== null) {
          sound = loadSound(bar.soundName, offlineCtx)
          if (sound !== null) {
            sound.play(step, lengthOfStep * i + j * stepsPerBar * lengthOfStep)
          }
        }
      }
  }

  return await offlineCtx.startRendering()
}
