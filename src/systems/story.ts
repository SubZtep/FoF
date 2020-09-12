import { addMixin, delEls, delMixin } from "../utils"

AFRAME.registerSystem("story", {
  schema: {
    txt: { type: "selector", default: ".txt" },
    box: { type: "selector", default: ".box" },
    l: { type: "selector", default: "#l" },
    r: { type: "selector", default: "#r" },
    stars: { type: "selector", default: ".stars" },
    ground: { type: "selector", default: ".ground" },
    player: { type: "selector", default: "#player" },
  },

  t: 0, // for timeout

  init() {
    this.el.addEventListener("loaded", () => {
      this.zoo = this.el.systems["zoo"]
      // this.s5()
    })
  },

  play() {
    this.el.addEventListener(
      "enter-vr",
      () => {
        this.s1()
      },
      { once: true }
    )
    this.el.addEventListener("exit-vr", location.reload)
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
      el,
      data: { txt, l, r, stars, ground },
    } = this

    addMixin(el)("fogout")

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
    let {
      el,
      data: { ground, player },
    } = this
    console.log("S5")
    delEls(".intro") // ?
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
