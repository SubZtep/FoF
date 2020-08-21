// Idea: https://codepen.io/jllodra/full/efsDd

AFRAME.registerComponent("tree-pythagoras", {
  schema: {
    edge: { type: "vec2", default: { x: 1, y: 2 } },
    levels: { type: "int", default: 10 },
  },

  init() {
    // console.log("POS", this.el.object3D.position)
    let color = new THREE.Color(0x995a00)
    let geometry = new THREE.BoxGeometry(this.data.edge.x, this.data.edge.y, this.data.edge.x)
    let material = new THREE.MeshPhongMaterial({ color, wireframe: false })
    let mesh = new THREE.Mesh(geometry, material)

    this.el.sceneEl.object3D.add(mesh)
    mesh.matrix.makeTranslation(0, -0.125, 0)
    mesh.matrixAutoUpdate = false

    const tree = (n: number, mat: THREE.Matrix4, c: THREE.Color) => {
      if (n > 0) {
        let new_mat = new THREE.Matrix4()
        let new_mat2 = new THREE.Matrix4()
        let new_mat_t0 = new THREE.Matrix4()
        let new_mat_t = new THREE.Matrix4()
        let new_mat_r = new THREE.Matrix4()
        let new_mat_r2 = new THREE.Matrix4()
        let new_mat_s = new THREE.Matrix4()
        let col1 = c.clone()
        let col2 = c.clone()

        col1.g += 0.64 / this.data.levels
        material = new THREE.MeshPhongMaterial({ color: col1, wireframe: false })
        mesh = new THREE.Mesh(geometry, material)
        // new_mat_t0.makeTranslation(this.data.edge.x / 2, 0, 0)
        new_mat_t0.makeTranslation(this.data.edge.x / 2, this.data.edge.y, 0)
        // new_mat_t.makeTranslation(0, this.data.edge.y, 0)
        new_mat_r.makeRotationZ(-Math.PI / 4)
        new_mat_r2.makeRotationY(Math.PI / 2)
        new_mat_s.makeScale(0.75, 0.75, 0.75)
        new_mat.multiply(new_mat_r2)
        new_mat.multiply(new_mat_t0)
        new_mat.multiply(new_mat_r)
        new_mat.multiply(new_mat_s)
        // new_mat.multiply(new_mat_t)
        new_mat.multiply(mat)
        mesh.matrix.copy(new_mat)
        mesh.matrixAutoUpdate = false
        this.el.sceneEl.object3D.add(mesh)
        tree(n - 1, mesh.matrix.clone(), col1)

        col2.g += 0.64 / this.data.levels
        material = new THREE.MeshPhongMaterial({ color: col2, wireframe: false })
        mesh = new THREE.Mesh(geometry, material)
        new_mat_t0.makeTranslation(-this.data.edge.x / 2, 0, 0)
        new_mat_t.makeTranslation(0, this.data.edge.y, 0)
        new_mat_r.makeRotationZ(Math.PI / 4)
        new_mat_r2.makeRotationY(Math.PI / 2)
        new_mat_s.makeScale(0.75, 0.75, 0.75)
        new_mat2.multiply(new_mat_r2)
        new_mat2.multiply(new_mat_t0)
        new_mat2.multiply(new_mat_r)
        new_mat2.multiply(new_mat_s)
        new_mat2.multiply(new_mat_t)
        new_mat2.multiply(mat)
        mesh.matrix.copy(new_mat2)
        mesh.matrixAutoUpdate = false
        this.el.sceneEl.object3D.add(mesh)
        tree(n - 1, mesh.matrix.clone(), col2)
      }
    }

    tree(this.data.levels, mesh.matrix, color)
  },
})
