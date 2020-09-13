import { Entity } from "aframe"
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

    // Kacsa
    tux: { type: "selector", default: "#tux" },
    stux: { type: "selector", default: "#stux" },

    // ??
    box: { type: "selector", default: ".box" },
    player: { type: "selector", default: "#player" },
  },

  novrListener() {
    this.data.player.object3D.position.y = 1.6
    this.noNovr()

    this.el.addState("novr")
    this.el.dispatchEvent(new CustomEvent("enter-vr"))
    // let c = this.data.player.object3D.children.find(e => e.el.classList.contains("camera"))
    // if (c) c.position.y = 1.6
  },

  noNovr() {
    clearTimeout(this.t)
    window.removeEventListener("novr", this.novrListener.bind(this))
    document.querySelector(".novr").remove()
  },

  novr() {
    window.addEventListener("novr", this.novrListener.bind(this))
    this.t = setTimeout(this.noNovr.bind(this), 5000)
  },

  hasControllers() {
    return (this.data.l.is("connected") && this.data.r.is("connected")) || this.el.is("novr")
  },

  s: 1,
  next() {
    window.addEventListener("keydown", e => {
      if (e.key === "n") {
        try {
        this[`s${++this.s}`]()
        console.log(`Load s${this.s}`)
        } catch {
          this.s = 0
        }
      }
    })
  },

  init() {
    let { el, data } = this
    this.novr()
    this.next()

    el.addEventListener("loaded", () => {
      this.zoo = el.systems["zoo"]

      this.pAM = addMixin(data.player)
      this.pDM = delMixin(data.player)
      this.elAM = addMixin(el)
      this.elDM = delMixin(el)
      this.grAM = addMixin(data.ground)
      this.grDM = delMixin(data.ground)
      this.txtAM = addMixin(data.txt)
      this.txtDM = delMixin(data.txt)
      this.txtVal = setText(data.txt)

      el.addEventListener("enter-vr", this.s1.bind(this), { once: true })
      el.addEventListener("exit-vr", location.reload)
    })
  },

  async s1() {
    this.elDM("elsunny", "elfogmid")("eldark", "fogzero")
    this.grAM("grsea", "grstream")
    if (!this.hasControllers()) {
      await this.s1_checkControllers()
    }
    this.s2()
  },

  async s1_checkControllers() {
    this.txtAM("msg")
    this.txtVal("Waiting for Controllers")
    await sleep(1)

    return new Promise(res => {
      let { l, r } = this.data
      l.addEventListener("stateadded", this.s1_chkCtrls.bind(this, res))
      l.addEventListener("stateremoved", this.s1_chkCtrls.bind(this, res))
      r.addEventListener("stateadded", this.s1_chkCtrls.bind(this, res))
      r.addEventListener("stateremoved", this.s1_chkCtrls.bind(this, res))
    })
  },

  s1_chkCtrls(res: () => void) {
    if (this.hasControllers()) {
      let { l, r } = this.data
      l.removeEventListener("stateadded", this.s1_checkControllers)
      l.removeEventListener("stateremoved", this.s1_checkControllers)
      r.removeEventListener("stateadded", this.s1_checkControllers)
      r.removeEventListener("stateremoved", this.s1_checkControllers)
      return res()
    }
  },

  async s2() {
    let { player, l, r, tux, stux } = this.data

    tux.setAttribute("visible", true)
    stux.setAttribute("visible", true)

    l.setAttribute("wasd-vr", "zombody", tux)
    r.setAttribute("wasd-vr", "zombody", tux)

    if (!this.el.is("novr")) this.pAM("playerintro")

    this.txtDM("msg")("title")
    this.txtVal("Flow of Four")
    await sleep(3)

    this.elAM("fogout")

    await sleep(1)
    this.txtVal()
    await sleep(3)

    this.el.addEventListener("introDone", this.s3.bind(this), { once: true })
  },

  async s3() {
    let {
      el,
      data: { ground, player, tux, stux, l, r },
    } = this

    tux.setAttribute("visible", false)
    stux.setAttribute("visible", false)

    l.setAttribute("wasd-vr", "zombody", null)
    r.setAttribute("wasd-vr", "zombody", null)

    document.querySelector("#l").setAttribute("wasd-vr", "target", "#player")
    document.querySelector("#r").setAttribute("wasd-vr", "target", "#player")

    this.grDM("grstream")("grstreamgo")
    this.elDM("eldark", "fogzero", "fogout")("elsunny", "fognear")

    let i: number
    for (i = 0; i < 2; i++) {
      this.zoo.kacsa().object3D.rotateY(135)
      await sleep(0.5)
    }

    await sleep(10)
    this.s4()
    // ground.setAttribute("gmat", "speed", { x: 0, y: 0 })
    // ground.setAttribute("gmat", { color: 0x499d45, color2: 0x000000 })
    // ground.setAttribute("visible", "true")
  },

  s4() {
    // LAND
    delEls(".intro")

    this.zoo.retk()
    this.data.stars.setAttribute("visible", false)
    this.grDM("grsea", "grstreamgo")("grgreen")
    this.elDM("fognear")("fogfar")
    // this.elDM("elsunny", "fognear")("fogfar")

    // delMixin(this.data.player)("playerintro")
    this.pDM("playerintro")("playerbase") //("playerbase")
    // re-set player position (?) (meybe walked away in the very beginning before zombikacsa)
  },
})
