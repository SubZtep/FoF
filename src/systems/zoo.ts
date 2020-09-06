import bird from "../3d/bird"

AFRAME.registerSystem("zoo", {
  init() {
    let e = document.createElement("a-entity")
    e.setAttribute("oscillator", "")
    e.setAttribute("analyser", "lag: true")
    let s = document.createElement("a-entity")
    s.setObject3D("bird", bird.rotateY(Math.PI).translateY(-0.37))
    s.setAttribute("handy", "")
    e.appendChild(s)
    e.object3D.position.set(0, 1.6, -4)
    e.object3D.rotateY(Math.PI / 2)
    this.sceneEl.appendChild(e)
  },
})
