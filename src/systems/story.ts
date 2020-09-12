import { addMixin, delEls, delMixin, setText, sleep } from "../utils"

AFRAME.registerSystem("story", {
  schema: {
    // controllers
    l: { type: "selector", default: "#l" },
    r: { type: "selector", default: "#r" },

    // environment
    stars: { type: "selector", default: ".stars" },
    ground: { type: "selector", default: ".ground" },

    // Text on screen center
    txt: { type: "selector", default: ".txt" },

    // ??
    box: { type: "selector", default: ".box" },
    player: { type: "selector", default: "#player" },
  },

  novr() {
    let t: any
    const novrListener = () => {
      noNovr()
      this.el.addState("novr")
      this.el.dispatchEvent(new CustomEvent("enter-vr"))
      let c = this.data.player.object3D.children.find(e => e.el.classList.contains("camera"))
      if (c) c.position.y = 1.6
    }
    const noNovr = () => {
      clearTimeout(t)
      window.removeEventListener("novr", novrListener)
      document.querySelector(".novr").remove()
    }
    t = setTimeout(noNovr, 5000)
    window.addEventListener("novr", novrListener)
  },

  hasControllers() {
    return (this.data.l.is("connected") && this.data.r.is("connected")) || this.el.is("novr")
  },

  init() {
    let { el, data } = this
    this.novr()

    el.addEventListener("loaded", () => {
      this.zoo = el.systems["zoo"]

      this.elAM = addMixin(el)
      this.elDM = delMixin(el)
      this.grAM = addMixin(data.ground)
      this.txtAM = addMixin(data.txt)
      this.txtDM = delMixin(data.txt)
      this.txtVal = setText(data.txt)

      el.addEventListener("enter-vr", this.s1.bind(this), { once: true })
      el.addEventListener("exit-vr", location.reload)
    })
  },

  async s1() {
    this.elDM("elsunny", "elfogmid")("eldark", "fogzero")
    this.grAM("grsea")
    if (!this.hasControllers()) {
      await this.s1_checkControllers()
    }
    this.s2()
  },

  async s1_checkControllers() {
    let { l, r } = this.data

    this.txtAM("msg")
    this.txtVal("Waiting for Controllers")
    await sleep(1)

    const chkCtrls = async res => {
      if (this.hasControllers()) {
        l.removeEventListener("stateadded", this.s1_checkControllers)
        l.removeEventListener("stateremoved", this.s1_checkControllers)
        r.removeEventListener("stateadded", this.s1_checkControllers)
        r.removeEventListener("stateremoved", this.s1_checkControllers)
        this.txtVal("")
        await sleep(0.1)
        this.txtVal("Controllers Found")
        await sleep(1)
        return res()
      }
    }

    return new Promise(res => {
      l.addEventListener("stateadded", chkCtrls.bind(this, res))
      l.addEventListener("stateremoved", chkCtrls.bind(this, res))
      r.addEventListener("stateadded", chkCtrls.bind(this, res))
      r.addEventListener("stateremoved", chkCtrls.bind(this, res))
    })
  },

  async s2() {
    this.txtDM("msg")("title")
    this.txtVal("Flow of Four")
    await sleep(5)

    this.grAM("grstream")
    this.elAM("fogout")

    await sleep(5)
    // ground.setAttribute("gmat", "speed", { x: 0, y: 0.0001 })

    // this.t = setTimeout(this.s3.bind(this), 5000)
    this.s3()
  },

  s3() {
    console.log("s3")
    let {
      el,
      data: { txt, l, r, stars, ground },
    } = this

    // this.elAM("fogout")
    // addMixin(el)("fogout")

    // this.t = setTimeout(this.s4.bind(this), 3000)
    this.s4()
  },

  s4() {
    console.log("s4")
    let { txt, stars } = this.data

    delMixin(txt)("title")
    stars.setAttribute("visible", true)

    this.el.addEventListener("introDone", this.s5.bind(this), { once: true })

    // for (let i = 0; i < 10; i++) {
    //   delay += 500
    //   setTimeout(() => {
    //     this.zoo.kacsa()
    //   }, delay)
    // }
  },

  s5() {
    console.log("s5")
    let {
      el,
      data: { ground, player },
    } = this
    // delEls(".intro") // ?
    let kacsa = document.querySelector("#tut")
    kacsa.removeAttribute("wasd-ext")

    document.querySelector("#l").setAttribute("wasd-vr", "target", "#player")
    document.querySelector("#r").setAttribute("wasd-vr", "target", "#player")

    delMixin(player)("playerintro")

    delMixin(el)("fullfog")
    addMixin(el)("scenesun")

    ground.setAttribute("gmat", "speed", { x: 0, y: 0 })
    ground.setAttribute("gmat", { color: 0x499d45, color2: 0x000000 })
    ground.setAttribute("visible", "true")
  },
})
