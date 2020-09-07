AFRAME.registerComponent("ground", {
  schema: {
    size: {
      type: "number",
      default: 100,
    },
    playArea: {
      type: "number",
      default: 0.85,
    },
    groundYScale: {
      type: "number",
      default: 1.5,
    },
    resolution: {
      type: "number",
      default: 64,
    },
  },

  update() {
    // this.addBeach()
    // this.el.object3D.scale.set(1, -1, this.data.groundYScale)

    let geometry = this.getGeometry(this.data.size, this.data.resolution)
    let mesh = new THREE.Mesh(geometry, this.getMaterial(this.data.size, false))
    mesh.matrixAutoUpdate = false
    this.el.setObject3D("mesh", mesh)
  },

  addBeach() {
    let w = this.data.size
    let shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.lineTo(0, w)
    shape.lineTo(w, w)
    shape.lineTo(w, 0)
    shape.lineTo(0, 0)

    let geometry = new THREE.ExtrudeGeometry(shape, {
      steps: 1,
      depth: 1,
      bevelOffset: 0,
      bevelThickness: 1,
      bevelSize: 10,
      bevelSegments: 1,
    })
    let material = new THREE.MeshPhongMaterial({ color: 0x00cc00, wireframe: false })
    let mesh = new THREE.Mesh(geometry, material)
    mesh.matrixAutoUpdate = false
    mesh.position.set(-w / 2, -w / 2, -2.1)
    mesh.updateMatrix()

    this.el.setObject3D("beach", mesh)
  },

  /**
   * @param resolution number of divisions of the ground mesh
   */
  getGeometry(stageSize: number, resolution: number) {
    let geo = new THREE.PlaneGeometry(stageSize, stageSize, resolution, resolution)

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
      // if (h > 1.5) h = 1.5

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

    return geo
  },

  /**
   * update ground, playarea and grid textures.
   * @param texMeters ground texture of 20 x 20 meters
   */
  getMaterial(stageSize: number, wireframe: false, resolution = 2048, texMeters = 20) {
    let texRepeat = stageSize / texMeters

    let canvas: any = document.createElement("canvas")
    canvas.width = resolution
    canvas.height = resolution

    let map = new THREE.Texture(canvas)
    map.wrapS = THREE.RepeatWrapping
    map.wrapT = THREE.RepeatWrapping
    map.repeat.set(texRepeat, texRepeat)

    let material = new THREE.MeshLambertMaterial({ map, wireframe })
    // let material = new THREE.MeshPhongMaterial({ color: new THREE.Color(0x00ff00), wireframe: true })

    this.drawTexture(canvas.getContext("2d"), resolution)
    map.needsUpdate = true

    return material
  },

  drawTexture(ctx: CanvasRenderingContext2D, size: number, groundColor = "#499d45", groundColor2 = "#000") {
    ctx.fillStyle = groundColor
    ctx.fillRect(0, 0, size, size)

    let i: number
    let col: THREE.Color
    let col1: THREE.Color
    let col2: THREE.Color
    let im: Uint8ClampedArray
    let imdata: ImageData

    // walkernoise
    let s = Math.floor(size / 2)
    let tex: any = document.createElement("canvas")
    tex.width = s
    tex.height = s
    let texctx = tex.getContext("2d")
    texctx.fillStyle = groundColor
    texctx.fillRect(0, 0, s, s)
    imdata = texctx.getImageData(0, 0, s, s)
    im = imdata.data
    col1 = new THREE.Color(groundColor)
    col2 = new THREE.Color(groundColor2)
    let walkers = []
    let numwalkers = 1000
    for (i = 0; i < numwalkers; i++) {
      col = col1.clone().lerp(col2, Math.random())
      walkers.push({
        x: Math.random() * s,
        y: Math.random() * s,
        r: Math.floor(col.r * 255),
        g: Math.floor(col.g * 255),
        b: Math.floor(col.b * 255),
      })
    }
    let iterations = 5000
    for (let it = 0; it < iterations; it++) {
      for (i = 0; i < numwalkers; i++) {
        let walker = walkers[i]
        let pos = Math.floor(walker.y * s + walker.x) * 4
        im[pos + 0] = walker.r
        im[pos + 1] = walker.g
        im[pos + 2] = walker.b
        walker.x += Math.floor(Math.random() * 3) - 1
        walker.y += Math.floor(Math.random() * 3) - 1
        if (walker.x >= s) walker.x = walker.x - s
        if (walker.y >= s) walker.y = walker.y - s
        if (walker.x < 0) walker.x = s + walker.x
        if (walker.y < 0) walker.y = s + walker.y
      }
    }
    texctx.putImageData(imdata, 0, 0)
    ctx.drawImage(tex, 0, 0, size, size)
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
