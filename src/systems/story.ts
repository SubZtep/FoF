import { Entity } from "aframe"
import { addMixin, clearMixins, delEls, delMixin, setText, sleep } from "../utils"

AFRAME.registerSystem("story", {
  schema: {
    // controllers
    l: { type: "selector", default: "#l" },
    r: { type: "selector", default: "#r" },

    // environment
    stars: { type: "selector", default: ".stars" },
    ground: { type: "selector", default: ".ground" },

    // Text on screen center
    // txt: { type: "selector", default: ".txt" },
    title: { type: "selector", default: ".title" },
    msg: { type: "selector", default: ".msg" },

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
    this.t = setTimeout(this.noNovr.bind(this), 8000)
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
          // console.log(`Load s${this.s}`)
        } catch {
          this.s = 0
        }
      }
    })
  },

  init() {
    // let { el, data } = this
    // this.novr()
    // this.next()
    // el.addEventListener("loaded", () => {
    //   this.zoo = el.systems["zoo"]
    //   // this.forest = el.systems["forest"]
    //   this.pAM = addMixin(data.player)
    //   this.pDM = delMixin(data.player)
    //   this.elAM = addMixin(el)
    //   this.elDM = delMixin(el)
    //   this.stAM = addMixin(data.stars)
    //   this.stDM = delMixin(data.stars)
    //   this.grAM = addMixin(data.ground)
    //   this.grDM = delMixin(data.ground)
    //   el.addEventListener("enter-vr", this.s1.bind(this), { once: true })
    //   el.addEventListener("exit-vr", location.reload)
    // })
  },

  async s1() {
    // this.s = 1
    this.elDM("elstart")("eldark")
    this.data.ground.setAttribute("visible", true)
    this.data.stars.setAttribute("visible", true)
    await sleep(5)

    if (!this.hasControllers()) {
      this.data.msg.setAttribute("visible", "true")
      await sleep(2)
      await this.s1_checkControllers()
      this.data.msg.setAttribute("visible", "false")
    }
    this.s2()
  },

  async s1_checkControllers() {
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
    // this.s = 2
    let { player, l, r, tux, stux } = this.data

    l.setAttribute("wasd-vr", "zombody", tux)
    r.setAttribute("wasd-vr", "zombody", tux)

    this.data.title.setAttribute("visible", "true")
    this.elAM("fogin")
    await sleep(2)
    addMixin(this.data.title)("rotmov")
    this.grDM("grdark")("grsea", "grstream")
    await sleep(1)

    player.object3D.rotateY(0)
    if (!this.el.is("novr")) player.object3D.position.set(0, -0.5, 2.5)

    this.elAM("fogout")
    await sleep(3)

    tux.setAttribute("visible", true)
    stux.setAttribute("visible", true)

    this.data.title.setAttribute("visible", "false")

    this.t = setTimeout(() => {
      this.data.msg.setAttribute("text", "value", "Use the controller, try to grab and match!")
      this.data.msg.setAttribute("visible", "true")
      this.t = setTimeout(() => {
        this.data.msg.setAttribute("visible", "false")
      }, 5000)
    }, 5000)

    this.el.addEventListener("introDone", this.s3.bind(this), { once: true })
  },

  async s3() {
    // this.s = 3
    clearTimeout(this.t)
    this.data.msg.setAttribute("visible", "false")
    let { player, tux, stux, l, r } = this.data
    player.object3D.rotateY(0)

    // player.object3D.position.set(0, this.el.is("novr") ? 1 : -0.2, 2.5)

    // tux.setAttribute("visible", false)
    // stux.setAttribute("visible", false)
    delEls("#stux")
    delEls("#tux")

    l.setAttribute("wasd-vr", "zombody", null)
    r.setAttribute("wasd-vr", "zombody", null)
    l.setAttribute("wasd-vr", "target", "#player")
    r.setAttribute("wasd-vr", "target", "#player")

    if (!this.el.is("novr")) player.object3D.position.set(0, 0, -1)

    this.grDM("grstream")("grstreamgo")
    // this.elDM("eldark", "fogzero", "fogout")("elsunny", "fogmid")
    this.elDM("eldark")("elsunny")

    let i: number
    for (i = 0; i < 9; i++) {
      this.zoo.kacsa()?.object3D.rotateY(135)
      await sleep(0.5)
    }

    // await sleep(8)
    await sleep(2)

    this.grAM("para")
    await sleep(2)

    this.s4()
  },

  async s4() {
    // this.s = 4
    this.zoo.retk()

    this.data.ground.setAttribute("rotation", "-90  0  0")
    this.data.ground.setAttribute("position", "0  0  0")

    this.data.stars.setAttribute("visible", false)
    this.grDM("para", "grsea", "grstreamgo")("grgreen")
    delEls(".intro")
    this.elAM("fogout")
    await sleep(5)
    this.grAM("para")
    await sleep(2)

    this.s5()
    // LAND
    // this.forest.deploy()
    // clearMixins(this.el)
    // this.elDM("elsunny", "fogfar")

    // delMixin(this.data.player)("playerintro")
    // this.pDM("playerintro")("playerbase") //("playerbase")
    // re-set player position (?) (meybe walked away in the very beginning before zombikacsa)
  },

  async s5() {
    //TODO

    let { ground } = this.data

    ground.setAttribute("rotation", { x: -90, y: 0, z: 0 })
    ground.setAttribute("position", { x: 0, y: 0, z: 0 })

    let all = document.querySelectorAll(".w") as NodeListOf<Entity>,
      len = all.length,
      // el: Entity,
      i: number
    for (i = 0; i < len; i++) {
      all[i].setAttribute("visible", "true")
    }

    this.data.player.object3D.position.set(-30, 1.6, -30)

    clearMixins(this.el)
    clearMixins(ground)

    this.grAM("grweed")
    this.elAM("ellila", "fogfar")
    // this.elAM("ellila", "fogfar")

    // this.forest.deploy()

    // console.log(this.el.systems.forest)
    // this.el.systems.forest.deploy()

    this.el.systems.forest.el.dispatchEvent(new CustomEvent("secretforest"))
    this.elAM("fogout")
    //await sleep(3)
    ground.setAttribute("visible", "true")
    // this.el.systems.forest.el.addState("secretforest")
  },
})
