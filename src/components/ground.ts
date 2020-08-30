AFRAME.registerComponent("ground", {
  schema: {
    stageSize: {
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
    // apply Y scale. There's no need to recalculate the geometry for this. Just change scale
    this.el.object3D.scale.set(1, -1, this.data.groundYScale)
    let groundGeometry = this.getGeometry(this.data.stageSize, this.data.resolution, this.data.playArea)

    let groundMaterial = this.getMaterial(this.data.stageSize, 2048, 20)
    let mat = new THREE.MeshPhongMaterial({ color: "black", vertexColors: true, flatShading: true, wireframe: true })

    let mesh = new THREE.Mesh(groundGeometry, groundMaterial)
    this.el.setObject3D("mesh", mesh)

    // Start Ground Worker
    this.createWorker(groundGeometry.vertices)
  },

  createWorker(vertices: THREE.Vector3) {
    const worker = new Worker("ground.js")
    worker.postMessage({
      cmd: "vertices",
      payload: vertices,
    })
    this.el.sceneEl.groundWorker = worker
  },

  /**
   * @param resolution number of divisions of the ground mesh
   */
  getGeometry(stageSize: number, resolution: number, playArea: number) {
    let groundGeometry = new THREE.PlaneGeometry(stageSize + 2, stageSize + 2, resolution - 1, resolution - 1)

    let verts = groundGeometry.vertices
    let numVerts = groundGeometry.vertices.length
    let frequency = 10
    let inc = frequency / resolution

    for (let i = 0, x = 0, y = 0; i < numVerts; i++) {
      let h = this.random(i) < 0.35 ? this.random(i + 1) : 0 // noise
      h += this.random(i + 2) * 0.1 // add some randomness

      // flat ground in the center
      let xx = (x * 2) / frequency - 1
      let yy = (y * 2) / frequency - 1
      xx = Math.max(0, Math.min(1, (Math.abs(xx) - (playArea - 0.9)) * (1 / playArea)))
      yy = Math.max(0, Math.min(1, (Math.abs(yy) - (playArea - 0.9)) * (1 / playArea)))
      h *= xx > yy ? xx : yy
      if (h < 0.01) h = 0 // stick to the floor

      // set height
      verts[i].z = h

      // calculate next x,y ground coordinates
      x += inc
      if (x >= 10) {
        x = 0
        y += inc
      }
    }

    groundGeometry.computeFaceNormals()
    groundGeometry.computeVertexNormals()

    groundGeometry.verticesNeedUpdate = true
    groundGeometry.normalsNeedUpdate = true

    return groundGeometry
  },

  /**
   * update ground, playarea and grid textures.
   * @param texMeters ground texture of 20 x 20 meters
   */
  getMaterial(stageSize: number, groundResolution: number, texMeters: number) {
    let texRepeat = stageSize / texMeters

    let gridCanvas: any = document.createElement("canvas")
    gridCanvas.width = groundResolution
    gridCanvas.height = groundResolution
    let gridTexture = new THREE.Texture(gridCanvas)
    gridTexture.wrapS = THREE.RepeatWrapping
    gridTexture.wrapT = THREE.RepeatWrapping
    gridTexture.repeat.set(texRepeat, texRepeat)

    let groundCanvas: any = document.createElement("canvas")
    groundCanvas.width = groundResolution
    groundCanvas.height = groundResolution
    let groundTexture = new THREE.Texture(groundCanvas)
    groundTexture.wrapS = THREE.RepeatWrapping
    groundTexture.wrapT = THREE.RepeatWrapping
    groundTexture.repeat.set(texRepeat, texRepeat)

    // ground material diffuse map is the regular ground texture and the grid texture
    // is used in the emissive map. This way, the grid is always equally visible, even at night.
    let groundMaterialProps = {
      map: groundTexture,
      emissive: new THREE.Color(0xffffff),
      emissiveMap: gridTexture,
    }

    let groundMaterial = new THREE.MeshLambertMaterial(groundMaterialProps)
    // let groundMaterial = new THREE.MeshPhongMaterial({ color: new THREE.Color(0x00ff00), wireframe: true })

    let groundctx = groundCanvas.getContext("2d")
    this.drawTexture(groundctx, groundResolution)
    groundTexture.needsUpdate = true

    return groundMaterial
  },

  // draw ground texture to a canvas context
  drawTexture(ctx: CanvasRenderingContext2D, size: number, groundColor = "#836a14", groundColor2 = "#060") {
    // fill all with ground Color
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
