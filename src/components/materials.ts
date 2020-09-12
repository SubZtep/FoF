let mats = {
  lambert: new THREE.MeshLambertMaterial({
    vertexColors: true,
  }),

  phong: new THREE.MeshPhongMaterial({
    vertexColors: true,
    flatShading: true,
  }),

  toon: new THREE.MeshToonMaterial({
    color: "#d5ff80",
    vertexColors: true,
  }),
}

AFRAME.registerComponent("mat", {
  schema: {
    default: "lambert",
  },
  init() {
    let material = mats[this.data]
    // material.color.convertSRGBToLinear()
    this.el.getObject3D("mesh").material = material
  },
})

AFRAME.registerComponent("gmat", {
  dependencies: ["geometry"],

  schema: {
    size: { default: 100 },
    color: { type: "color", default: "#13f" },
    color2: { type: "color", default: "#000" },
    speed: { type: "vec2", default: { x: 0, y: 0 } }, //
    // speed: { type: "vec2", default: { x: 0, y: -0.00005 } },
  },

  sv: new THREE.Vector2(),

  init() {
    this.mesh = this.el.getObject3D("mesh")
    this.mesh.material = this.getMaterial()
  },

  update(oldData) {
    let { el, data } = this
    if (data.color !== oldData.color || data.color2 !== oldData.color2) {
      //TODO: update only texture
      el.getObject3D("mesh").material = this.getMaterial()
    }
  },

  tick(_, deltaTime) {
    let {
      data: {
        speed: { x, y },
      },
    } = this
    if (x !== 0 || y !== 0) {
      // this.el.getObject3D("mesh").material.map.offset.add(this.sv.set(x, y).multiplyScalar(deltaTime))
      // this.mat.map.offset.add(this.sv.set(x, y).multiplyScalar(deltaTime))
      this.mesh.material.map.offset.add(this.sv.set(x, y).multiplyScalar(deltaTime))
    }
  },

  /**
   * @param texMeters ground texture of 20 x 20 meters
   */
  getMaterial(wireframe = false, resolution = 2048, texMeters = 20) {
    let texRepeat = this.data.size / texMeters

    let canvas: any = document.createElement("canvas")
    canvas.width = resolution
    canvas.height = resolution

    let map = new THREE.Texture(canvas)
    map.wrapS = THREE.RepeatWrapping
    map.wrapT = THREE.RepeatWrapping
    map.repeat.set(texRepeat, texRepeat)

    let material = new THREE.MeshLambertMaterial({ map, wireframe })

    this.drawTexture(canvas.getContext("2d"), resolution)
    map.needsUpdate = true

    return material
  },

  drawTexture(ctx: CanvasRenderingContext2D, size: number) {
    let { data } = this
    ctx.fillStyle = data.color
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
    texctx.fillStyle = data.color
    texctx.fillRect(0, 0, s, s)
    imdata = texctx.getImageData(0, 0, s, s)
    im = imdata.data

    col1 = new THREE.Color(data.color)
    col1.convertSRGBToLinear()
    col2 = new THREE.Color(data.color2)
    col2.convertSRGBToLinear()

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
})
