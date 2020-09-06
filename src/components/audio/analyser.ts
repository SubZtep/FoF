import { DetailEvent } from "aframe"

AFRAME.registerComponent("analyser", {
  schema: {
    fftSize: {
      default: 2048,
      oneOf: [32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768],
    },
    length: {
      type: "number",
      default: 10,
    },
    width: {
      type: "number",
      default: 2,
    },
    lag: {
      default: false,
    },
  },

  nextFFT() {
    this.el.setAttribute(this.attrName, {
      fftSize: Math.pow(2, Math.max((Math.log2(this.data.fftSize) + 1) % 16, 5)),
    })
  },

  init() {
    this.el.addEventListener("pos-audio-active", this.setup.bind(this))
  },

  setup({ detail: audio }: DetailEvent<THREE.PositionalAudio>) {
    this.analyser = audio.context.createAnalyser()
    this.analyser.smoothingTimeConstant = 1
    audio.getOutput().connect(this.analyser)
    this.el.addEventListener("click", this.nextFFT.bind(this))

    this.lineObj = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: "#ff0" }))
    this.lineObj.frustumCulled = false // render line even its parent not in viewing frustum
    this.el.setObject3D("line", this.lineObj)
    this.update({})
  },

  update(oldData) {
    if (this.analyser && (this.data.fftSize !== oldData.fftSize || this.data.length !== oldData.length)) {
      this.analyser.fftSize = this.data.fftSize
      this.bufferLength = this.analyser.frequencyBinCount
      this.sliceLength = this.data.length / this.bufferLength
      this.tddata = new Float32Array(this.bufferLength)

      this.lineObj.geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(this.bufferLength * 3), 3)
      )
    }
    this.halfWidth = this.data.width / 2
  },

  tick(time) {
    if (!this.analyser) return

    // console.time("aaa")

    if (this.data.lag) {
      let t = Math.round(time / 100)
      if (t === this.lastTime) return
      this.lastTime = t
    }

    this.analyser.getFloatTimeDomainData(this.tddata)
    let pos = this.lineObj.geometry.attributes.position
    let posa = pos.array
    let index = 0
    let i: number

    for (i = 0; i < this.bufferLength; i++) {
      posa[index++] = Math.random() / 4 - 0.1
      posa[index++] = this.tddata[i] * this.halfWidth
      posa[index++] = -this.sliceLength * i
    }

    // console.timeEnd("aaa")
    pos.needsUpdate = true
  },
})
