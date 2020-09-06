/**
 * http://what-when-how.com/3d-animation-using-maya
 * /modeling-primitives-wireframes-surfaces-and-normals-essential-skills-3d-animation-using-maya-part-1/
 */

import { setColor } from "../utils"

export const geo = () => {
  let blue = new THREE.Color("#1da1f2")
  let yellow = new THREE.Color("#ffff00")

  let geo = new THREE.Geometry()

  let body = new THREE.SphereGeometry(1, 8, 8)
  setColor(body, blue)
  body.translate(0, 1.4, 0)
  geo.merge(body)

  let head = new THREE.SphereGeometry(0.75, 8, 8)
  setColor(head, blue)
  head.scale(0.75, 0.75, 0.75)
  head.translate(0, 2.8, 0.33)
  geo.merge(head)

  let beak = new THREE.ConeGeometry(1, 2, 8)
  setColor(beak, yellow)
  beak.rotateX(Math.PI / 1.6)
  beak.scale(0.42, 0.42, 0.42)
  beak.translate(0, 2.6, 0.8)
  geo.merge(beak)

  let leftWing = new THREE.CylinderGeometry(0.9, 1, 0.1)
  setColor(leftWing, blue)
  leftWing.rotateX(48)
  leftWing.rotateY(8)
  leftWing.rotateZ(45 - 28)
  leftWing.scale(0.2, 0.68, 0.5)
  leftWing.translate(-1.1, 1.45, -0.2)
  geo.merge(leftWing)

  let rightWing = new THREE.CylinderGeometry(0.9, 1, 0.1)
  setColor(rightWing, blue)
  rightWing.rotateX(48)
  rightWing.rotateY(-8)
  rightWing.rotateZ(-45 + 28)
  rightWing.scale(0.2, 0.68, 0.5)
  rightWing.translate(1.1, 1.45, -0.2)
  geo.merge(rightWing)

  geo.scale(0.15, 0.15, 0.15)

  return geo
}

export const mat = () => new THREE.MeshLambertMaterial({ vertexColors: true })

export default new THREE.Mesh(geo(), mat())
