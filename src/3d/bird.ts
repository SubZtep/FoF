/**
 * http://what-when-how.com/3d-animation-using-maya
 * /modeling-primitives-wireframes-surfaces-and-normals-essential-skills-3d-animation-using-maya-part-1/
 */
import { rnd, setColor } from "../utils"

AFRAME.registerGeometry("bird", {
  init() {
    let blue = new THREE.Color(0x1da1f2)
    let yellow = new THREE.Color(0xffff00)

    let geo = new THREE.Geometry()

    let body = new THREE.SphereGeometry(1, 8, 8).translate(0, 1.4, 0)
    setColor(body, blue)
    geo.merge(body)

    let head = new THREE.SphereGeometry(0.75, 8, 8).scale(0.75, 0.75, 0.75).translate(0, 2.8, 0.33)
    setColor(head, blue)
    geo.merge(head)

    let beak = new THREE.ConeGeometry(1, 2, 8)
      .rotateX(Math.PI / 1.6)
      .scale(0.42, 0.42, 0.42)
      .translate(0, 2.6, 0.8)
    setColor(beak, yellow)
    geo.merge(beak)

    let leftWing = new THREE.CylinderGeometry(0.9, 1, 0.1)
      .rotateX(48)
      .rotateY(8)
      .rotateZ(45 - 28)
      .scale(0.2, 0.68, 0.5)
      .translate(-1.1, 1.45, -0.2)
    setColor(leftWing, blue)
    geo.merge(leftWing)

    let rightWing = new THREE.CylinderGeometry(0.9, 1, 0.1)
      .rotateX(48)
      .rotateY(-8)
      .rotateZ(-45 + 28)
      .scale(0.2, 0.68, 0.5)
      .translate(1.1, 1.45, -0.2)
    setColor(rightWing, blue)
    geo.merge(rightWing)

    geo.scale(0.15, 0.15, 0.15)
    // geo.translate(rnd(-5, 5), 3, -2)

    this.geometry = geo
  },
})
