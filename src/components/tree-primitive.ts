import { rnd } from "../utils"

AFRAME.registerComponent("tree-primitive", {
  init() {
    let scene = this.el.sceneEl.object3D
    let pos: THREE.Vector3 = this.el.object3D.position
    // let scale: THREE.Vector3 = this.el.object3D.scale

    // let tree = new THREE.Group()
    // let tree = new THREE.Object3D()
    // scene.add(tree)

    let trunkHeight = 3

    let trunkGeometry = new THREE.CylinderGeometry(0.1, 0.2, trunkHeight, 32)
    let trunkMaterial = new THREE.MeshBasicMaterial({ color: 0xa52a2a })
    let trunkCylinder = new THREE.Mesh(trunkGeometry, trunkMaterial)
    trunkCylinder.castShadow = true
    trunkCylinder.receiveShadow = false
    trunkCylinder.position.y += trunkHeight / 2

    this.el.setObject3D("mesh", trunkCylinder)

    // this.el.object3D = trunkCylinder.ob
    // scene.add(trunkCylinder)

    // trunkCylinder.position.y = 1

    // trunkCylinder.position.set(pos.x, pos.y + 1, pos.z)

    // scene.add(trunkCylinder)
    // trunkCylinder.position.set(pos.x, pos.y, pos.z)

    // trunkCylinder.scale.set(scale.x, scale.y, scale.z)
    // scene.add(trunkCylinder)

    // trunkCylinder.matrixAutoUpdate = false

    // trunkCylinder.attach(tree)
    // tree.attach(trunkCylinder)
    // tree.add(trunkCylinder)

    // let foliageGeometry = new THREE.TetrahedronGeometry(rnd(1, 1.5), 2)
    // let foliageMaterial = new THREE.MeshBasicMaterial({ color: 0x006400 })
    // let foliageTetrahedron = new THREE.Mesh(foliageGeometry, foliageMaterial)
    // foliageTetrahedron.castShadow = true
    // foliageTetrahedron.receiveShadow = false
    // // foliageTetrahedron.position.y = 2.5
    // foliageTetrahedron.position.set(pos.x, pos.y + 2.5, pos.z)
    // // foliageTetrahedron.scale.set(scale.z, scale.y, scale.x)
    // // scene.add(foliageTetrahedron)

    // // foliageTetrahedron.matrixAutoUpdate = false
    // tree.attach(foliageTetrahedron)
    // tree.add(foliageTetrahedron)

    // // tree.position.set(pos.x, 0, pos.z)
    // tree.position.x = pos.x
    // tree.position.z = pos.z
  },
})

// AFRAME.registerPrimitive("a-tree", {
//   defaultComponents: {
//     "tree-primitive": {},
//   },
// })
