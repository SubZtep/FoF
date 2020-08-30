import { DetailEvent } from "aframe"

AFRAME.registerComponent("soundwave", {
  init() {
    this.el.addEventListener("pos-audio-active", this.setup.bind(this))
  },

  setup({ detail: audio }: DetailEvent<THREE.PositionalAudio>) {
    this.analyser = audio.context.createAnalyser()
    audio.getOutput().connect(this.analyser)
  },

  tick(time) {
    if (!this.analyser) return

    const t = Math.round(time / 100)
    if (t === this.lastTime) return
    this.lastTime = t

    var geometry = new THREE.Geometry()
    const width = 10
    const bufferLength = this.analyser.frequencyBinCount
    const data = new Float32Array(bufferLength)
    this.analyser.getFloatTimeDomainData(data)

    let sliceWidth = width / bufferLength
    for (let i = 0; i < bufferLength; i++) {
      const pos = new THREE.Vector3(0, data[i] * 3, -sliceWidth * i)
      geometry.vertices.push(pos)
    }

    const line = new THREE.Line(geometry, new THREE.LineBasicMaterial())
    this.el.setObject3D("line", line)
  },
})
