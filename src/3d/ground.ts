AFRAME.registerGeometry("ground", {
  schema: {
    size: {
      default: 100,
    },
    resolution: {
      default: 32,
    },
  },

  init(data) {
    let { size, resolution } = data
    let geo = new THREE.PlaneGeometry(size, size, resolution, resolution)

    let verts = geo.vertices
    let numVerts = geo.vertices.length
    let frequency = 5
    let inc = frequency / resolution

    let col = Math.sqrt(numVerts)

    for (let i = 0, x = 0, y = 0; i < numVerts; i++) {
      let h = this.random(i) < 0.35 ? this.random(i + 1) : 0 // noise
      h += this.random(i + 2) * 0.1 // add some randomness

      let xx = (x * 2) / frequency - 1
      let yy = (y * 2) / frequency - 1

      h *= xx > yy ? xx : yy

      if (h < 0.01) h = 0 // stick to the floor

      // edges down
      if (i < col || i > numVerts - col - 1) {
        h = 0
      } else {
        let pos = i - col * Math.floor(i / col)
        if (pos === 0 || pos === col - 1) {
          h = 0
        }
      }

      // max spike height
      if (h > 1) h = 1

      // set height
      verts[i].z = h

      // calculate next x,y ground coordinates
      x += inc
      if (x >= 10) {
        x = 0
        y += inc
      }
    }

    geo.computeFaceNormals()
    geo.computeVertexNormals()

    geo.verticesNeedUpdate = true
    geo.normalsNeedUpdate = true

    this.geometry = geo
  },

  random(x: number, seed = 8) {
    return parseFloat(
      "0." +
        Math.sin(seed * 9999 * x)
          .toString()
          .substr(7)
    )
  },
})
