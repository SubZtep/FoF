AFRAME.registerComponent("tree", {
  schema: {
    pos: { type: "vec2" },
    scle: { type: "number" },
    //TODO: Add more parameters for various trees
  },
  init() {
    let scene = this.el.sceneEl.object3D

    let trunkGeometry = new THREE.CylinderGeometry(0.1, 0.2, 2, 32)
    let trunkMaterial = new THREE.MeshBasicMaterial({ color: 0xa52a2a })
    let trunkCylinder = new THREE.Mesh(trunkGeometry, trunkMaterial)
    trunkCylinder.castShadow = true
    trunkCylinder.receiveShadow = false
    trunkCylinder.position.set(this.data.pos.x, 1, this.data.pos.y)
    trunkCylinder.scale.multiplyScalar(this.data.scle)
    scene.add(trunkCylinder)

    let foliageGeometry = new THREE.TetrahedronGeometry(1, 2)
    let foliageMaterial = new THREE.MeshBasicMaterial({ color: 0x006400 })
    let foliageTetrahedron = new THREE.Mesh(foliageGeometry, foliageMaterial)
    foliageTetrahedron.castShadow = true
    foliageTetrahedron.receiveShadow = false
    foliageTetrahedron.position.set(this.data.pos.x, 2.5, this.data.pos.y)
    foliageTetrahedron.scale.multiplyScalar(this.data.scle)
    scene.add(foliageTetrahedron)
  },
})

AFRAME.registerPrimitive("a-tree", {
  defaultComponents: {
    tree: {},
  },
  mappings: {
    pos: "tree.pos",
    scle: "tree.scle",
  },
})
