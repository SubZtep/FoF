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
    c1: { type: "color", default: "#0f0" },
    c2: { type: "color", default: "#000" },
    offset: { type: "vec2", default: { x: 0, y: 0 } },
    // speed: { type: "vec2", default: { x: 0, y: 0 } }, //
    // speed: { type: "vec2", default: { x: 0, y: -0.00005 } },
  },

  sv: new THREE.Vector2(),

  init() {
    this.mesh = this.el.getObject3D("mesh")
    this.mesh.material = this.getMaterial()
  },

  update(old) {
    let { el, data } = this
    if (data.c1 !== old.c1 || data.c2 !== old.c2) {
      //TODO: update only texture
      el.getObject3D("mesh").material = this.getMaterial()
    }
    if (!old.offset || data.offset.x !== old.offset.x || data.offset.y !== old.offset.y) {
      this.mesh.material.map.offset.set(data.offset.x, data.offset.y)
    }
  },

  // tick(_, deltaTime) {
  //   let {
  //     data: {
  //       speed: { x, y },
  //     },
  //   } = this
  //   if (x !== 0 || y !== 0) {
  //     // this.el.getObject3D("mesh").material.map.offset.add(this.sv.set(x, y).multiplyScalar(deltaTime))
  //     // this.mat.map.offset.add(this.sv.set(x, y).multiplyScalar(deltaTime))
  //     this.mesh.material.map.offset.add(this.sv.set(x, y).multiplyScalar(deltaTime))
  //   }
  // },

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
    ctx.fillStyle = data.c1
    ctx.fillRect(0, 0, size, size)

    let i: number,
      c: THREE.Color,
      c1 = new THREE.Color(data.c1),
      c2 = new THREE.Color(data.c2),
      im: Uint8ClampedArray,
      imdata: ImageData,
      // walkernoise
      s = Math.floor(size / 2),
      tex: any = document.createElement("canvas")
    // c1.convertSRGBToLinear()
    // c2.convertSRGBToLinear()
    tex.width = s
    tex.height = s
    let texctx = tex.getContext("2d")
    texctx.fillStyle = c1
    texctx.fillRect(0, 0, s, s)
    imdata = texctx.getImageData(0, 0, s, s)
    im = imdata.data

    let walkers = []
    let numwalkers = 1000
    for (i = 0; i < numwalkers; i++) {
      c = c1.clone().lerp(c2, Math.random())
      c.convertSRGBToLinear()
      walkers.push({
        x: Math.random() * s,
        y: Math.random() * s,
        r: Math.floor(c.r * 255),
        g: Math.floor(c.g * 255),
        b: Math.floor(c.b * 255),
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
