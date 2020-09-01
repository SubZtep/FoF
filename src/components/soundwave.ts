import { DetailEvent } from "aframe"

AFRAME.registerComponent("soundwave", {
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
    type: {
      default: "line",
      oneOf: ["line", "lathe"],
    },
    lag: {
      default: true,
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
    audio.getOutput().connect(this.analyser)

    this.el.addEventListener("click", this.nextFFT.bind(this))
  },

  update() {
    if (this.analyser) {
      this.analyser.fftSize = this.data.fftSize
    }
    this.halfWidth = this.data.width / 2
    this.el.object3D.rotation.z = this.data.type === "line" ? 0 : Math.PI / 2
  },

  tick(time) {
    if (!this.analyser) return

    if (this.data.lag) {
      let t = Math.round(time / 100)
      if (t === this.lastTime) return
      this.lastTime = t
    }

    this[this.data.type](time)
  },

  line(time: number) {
    const bufferLength = this.analyser.frequencyBinCount
    const data = new Float32Array(bufferLength)
    this.analyser.getFloatTimeDomainData(data)

    let sliceLength = this.data.length / bufferLength

    let points = []
    for (let i = 0; i < bufferLength; i++) {
      const pos = new THREE.Vector3(0, data[i] * this.halfWidth, -sliceLength * i)
      points.push(pos)
    }

    let geometry = new THREE.BufferGeometry().setFromPoints(points)
    const line = new THREE.Line(geometry, new THREE.LineBasicMaterial())
    this.el.setObject3D("line", line)
  },

  lathe(time: number) {
    const bufferLength = this.analyser.frequencyBinCount
    const data = new Float32Array(bufferLength)
    this.analyser.getFloatTimeDomainData(data)

    let sliceLength = this.data.length / bufferLength

    let points = []
    for (let i = 0; i < bufferLength; i++) {
      const pos = new THREE.Vector2(data[i] * this.halfWidth, -sliceLength * i)
      points.push(pos)
    }

    let geometry = new THREE.LatheBufferGeometry(points, 5)
    let material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true })
    var lathe = new THREE.Mesh(geometry, material)

    this.el.setObject3D("lathe", lathe)
  },
})
