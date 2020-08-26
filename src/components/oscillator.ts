AFRAME.registerComponent("oscillator", {
  init() {
    // @ts-ignore
    let ctx = THREE.AudioContext.getContext()
    this.oscillator = ctx.createOscillator()
    //this.analyser = ctx.createAna
    this.oscillator.connect(ctx.destination)
    // this.oscillator.start()
  },

  remove() {
    // this.oscillator.disconnect()
  },
})
