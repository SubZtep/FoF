/// <reference types="../node_modules/super-three/src/Three" />

let STAGE_SIZE = 200

let resolution = 64 // number of divisions of the ground mesh

let environmentData = {
  seed: 8,
  playArea: 0.85,
  groundYScale: 4.18,
  groundColor: "#937a24",
  groundColor2: "#060",
  dressingAmount: 500,
  dressingColor: "#114611",
}

// draw ground texture to a canvas context
const drawTexture = (ctx: CanvasRenderingContext2D, size: number) => {
  // fill all with ground Color
  ctx.fillStyle = environmentData.groundColor
  ctx.fillRect(0, 0, size, size)

  let i: number,
    col: THREE.Color,
    col1: THREE.Color,
    col2: THREE.Color,
    im: Uint8ClampedArray,
    imdata: ImageData

  // walkernoise
  let s = Math.floor(size / 2)
  let tex: any = document.createElement("canvas")
  tex.width = s
  tex.height = s
  let texctx = tex.getContext("2d")
  texctx.fillStyle = environmentData.groundColor
  texctx.fillRect(0, 0, s, s)
  imdata = texctx.getImageData(0, 0, s, s)
  im = imdata.data
  col1 = new THREE.Color(environmentData.groundColor)
  col2 = new THREE.Color(environmentData.groundColor2)
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
}

const random = (x: number) => {
  return parseFloat(
    "0." +
      Math.sin(environmentData.seed * 9999 * x)
        .toString()
        .substr(7)
  )
}

export default () => {
  let ground = document.createElement("a-entity")
  ground.setAttribute("rotation", "-90 0 0")

  let groundGeometry = new THREE.PlaneGeometry(
    STAGE_SIZE + 2,
    STAGE_SIZE + 2,
    resolution - 1,
    resolution - 1
  )

  let verts = groundGeometry.vertices
  let numVerts = groundGeometry.vertices.length
  let frequency = 10
  let inc = frequency / resolution

  for (let i = 0, x = 0, y = 0; i < numVerts; i++) {
    let h = random(i) < 0.35 ? random(i + 1) : 0 // noise
    h += random(i + 2) * 0.1 // add some randomness

    // flat ground in the center
    let xx = (x * 2) / frequency - 1
    let yy = (y * 2) / frequency - 1
    let pa = environmentData.playArea
    xx = Math.max(0, Math.min(1, (Math.abs(xx) - (pa - 0.9)) * (1 / pa)))
    yy = Math.max(0, Math.min(1, (Math.abs(yy) - (pa - 0.9)) * (1 / pa)))
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

  // apply Y scale. There's no need to recalculate the geometry for this. Just change scale
  // @ts-ignore
  ground.setAttribute("scale", { z: environmentData.groundYScale })

  // update ground, playarea and grid textures.
  let groundResolution = 2048
  let texMeters = 20 // ground texture of 20 x 20 meters
  let texRepeat = STAGE_SIZE / texMeters

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

  let groundctx = groundCanvas.getContext("2d")

  drawTexture(groundctx, groundResolution)

  groundTexture.needsUpdate = true

  let mesh = new THREE.Mesh(groundGeometry, groundMaterial)
  // @ts-ignore
  ground.setObject3D("mesh", mesh)

  // @ts-ignore
  ground.setAttribute("shadow", {
    cast: false,
    receive: true,
  })

  document.querySelector("a-scene").appendChild(ground)
}
