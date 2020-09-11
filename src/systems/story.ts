import { DetailEvent, Entity } from "aframe"
import { addMixin, delMixin } from "../utils"

AFRAME.registerSystem("story", {
  schema: {
    txt: { type: "selector", default: ".txt" },
    box: { type: "selector", default: ".box" },
    l: { type: "selector", default: "#l" },
    r: { type: "selector", default: "#r" },
    stars: { type: "selector", default: ".stars" },
    ground: { type: "selector", default: ".ground" },
  },

  t: null,

  init() {
    setTimeout(() => {
      this.sceneEl.querySelectorAll(".novr").forEach(e => e.remove())
    }, 10000)

    this.zoo = this.el.systems["zoo"]

    this.el.addEventListener("loaded", () => {
      // this.el.addEventListener("enter-vr", this.s1.bind(this))
      this.el.addEventListener("exit-vr", location.reload)
      this.s1()
    })
  },

  s1() {
    let {
      el,
      data: { txt, l, r },
    } = this
    el.setAttribute("background", "color", 0x000000)

    addMixin(txt)("msg")
    txt.setAttribute("value", "Waiting for Controllers")

    l.addEventListener("stateadded", this.s1_checkControllers.bind(this))
    l.addEventListener("stateremoved", this.s1_checkControllers.bind(this))
    r.addEventListener("stateadded", this.s1_checkControllers.bind(this))
    r.addEventListener("stateremoved", this.s1_checkControllers.bind(this))

    this.s2()
  },

  s1_checkControllers() {
    if (this.data.l.is("connected") && this.data.r.is("connected")) {
      this.s2()
    }
  },

  s2() {
    let { l, r, txt, ground } = this.data

    l.removeEventListener("stateadded", this.s1_checkControllers)
    l.removeEventListener("stateremoved", this.s1_checkControllers)
    r.removeEventListener("stateadded", this.s1_checkControllers)
    r.removeEventListener("stateremoved", this.s1_checkControllers)

    addMixin(txt)("title")
    delMixin(txt)("msg")
    txt.setAttribute("value", "Flow of Four")

    ground.setAttribute("visible", true)
    ground.setAttribute("gmat", "speed", { x: 0, y: 0.0001 })

    // this.t = setTimeout(this.s3.bind(this), 3000)
    this.s3()
  },

  s3() {
    let {
      data: { txt, l, r, stars, ground },
    } = this

    addMixin(this.el)("fogout")

    // this.t = setTimeout(this.s4.bind(this), 3000)
    this.s4()
  },

  s4() {
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
    let all = document.querySelectorAll(".intro") as NodeListOf<Entity>,
      len = all.length,
      el: Entity,
      i: number
    for (i = 0; i < len; i++) {
      el = all[i]
      el.parentNode.removeChild(el).destroy()
    }
  },
})
