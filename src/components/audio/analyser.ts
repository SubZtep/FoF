import { DetailEvent } from "aframe"

AFRAME.registerComponent("analyser", {
  dependencies: ["pos-audio"],

  schema: {
    fftSize: {
      default: 512,
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
      default: 100,
    },
  },

  nextFFT() {
    this.el.setAttribute(this.attrName, {
      fftSize: Math.pow(2, Math.max((Math.log2(this.data.fftSize) + 1) % 16, 5)),
    })
  },

  init() {
    this.el.addEventListener("pos-audio-active", this.setup.bind(this))

    if (this.data.lag) {
      this.tick = AFRAME.utils.throttleTick(this.tick, 100, this)
    }
  },

  setup({ detail }: DetailEvent<THREE.PositionalAudio>) {
    this.analyser = detail.context.createAnalyser()
    detail.getOutput().connect(this.analyser)

    this.lineObj = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: "#ff0" }))
    this.el.setObject3D("line", this.lineObj)
    this.update({})

    this.audio = detail
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
    if (!this.audio) return

    if (this.data.lag) {
      let t = Math.round(time / 100)
      if (t === this.lastTime) return
      this.lastTime = t
    }

    let { exe } = this.el.object3D.parent.userData
    let len = exe !== undefined ? exe.value : 0
    // console.time("t")
    if (len === 0) {
      this.tddata.fill(0)
    } else {
      this.analyser.getFloatTimeDomainData(this.tddata)
    }

    this.audio.gain.gain.setValueAtTime(len, 0)

    let pos = this.lineObj.geometry.attributes.position
    let posa = pos.array
    let index = 0
    let i: number

    for (i = 0; i < this.bufferLength; i++) {
      posa[index++] = Math.random() / 16 - 0.04
      posa[index++] = this.tddata[i] * this.halfWidth
      posa[index++] = -this.sliceLength * i * len
    }
    // console.timeEnd("t")

    pos.needsUpdate = true
  },
})
