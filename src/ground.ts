/// <reference types="../node_modules/aframe/node_modules/super-three/src/Three" />

let STAGE_SIZE = 200

let resolution = 64 // number of divisions of the ground mesh

type Asset = {
  noise: number
  segments: number
  vertices: number[]
}

let trees: Asset[] = [
  {
    noise: 0.015,
    segments: 6,
    vertices: [0.000001, 0.826, 0.054, 0.832, 0.105, 0.854, 0.136, 0.9, 0.136, 0.958, 0.118, 0.994],
  },
  {
    noise: 0.015,
    segments: 14,
    vertices: [
      0.000001,
      0.01,
      0.069,
      0.022,
      0.13,
      0.068,
      0.178,
      0.18,
      0.189,
      0.32,
      0.191,
      0.59,
      0.193,
      0.75,
      0.138,
      0.79,
      0.018,
      0.808,
      0.018,
      0.996,
    ],
  },
  {
    noise: 0.015,
    segments: 14,
    vertices: [
      0.000001,
      0.436,
      0.126,
      0.46,
      0.201,
      0.57,
      0.219,
      0.72,
      0.154,
      0.846,
      0.028,
      0.884,
      0.034,
      0.996,
    ],
  },
]

let environmentData = {
  seed: 8,
  playArea: 0.85,
  // groundYScale: 4.18,
  groundColor: "#937a24",
  groundColor2: "#060",
  dressingAmount: 500,
  dressingColor: "#114611",
}

// returns an array of THREE.Geometry for set dressing
const getAssetGeometry = (data: Asset[]) => {
  let geoset = []

  const applyNoise = (geo: THREE.LatheGeometry, noise: number) => {
    let n = new THREE.Vector3()
    for (let i = 0, numVerts = geo.vertices.length; i < numVerts; i++) {
      n.x = (random(i) - 0.5) * noise
      n.y = (random(i + numVerts) - 0.5) * noise
      n.z = (random(i + numVerts * 2) - 0.5) * noise
      geo.vertices[i].add(n)
    }
  }

  let i: number, geo: THREE.LatheGeometry, verts: number[]

  for (let j = 0; j < data.length; j++) {
    let maxy = -99999
    let points = []
    verts = data[j].vertices
    for (i = 0; i < verts.length; i += 2) {
      points.push(new THREE.Vector2(verts[i], verts[i + 1]))
      if (verts[i + 1] > maxy) {
        maxy = verts[i + 1]
      }
    }
    geo = new THREE.LatheGeometry(points, data[j]["segments"] || 8)
    geo.applyMatrix(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(-Math.PI, 0, 0)))
    geo.applyMatrix(new THREE.Matrix4().makeTranslation(0, maxy, 0))
    applyNoise(geo, data[j].noise)
    geoset.push(geo)
  }
  return geoset
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

// updates set dressing
const updateDressing = () => {
  const dressing = document.createElement("a-entity")

  let dressingObj = new THREE.Object3D()
  let geometry = new THREE.Geometry() // mother geometry that will hold all instances

  // get array of geometries
  let geoset = getAssetGeometry(trees)

  for (let i = 0, r = 88343; i < environmentData.dressingAmount; i++, r++) {
    let geo = geoset[Math.floor(random(33 + i) * geoset.length)]

    // set random position, rotation and scale
    let dv = new THREE.Vector3(10, 10, 10)

    // No trees on play area
    let distance = 10 + Math.max(dv.x, dv.z) + 10 * random(r + 1) + (random(r + 2) * STAGE_SIZE) / 3

    let direction = random(r + 3) * Math.PI * 2
    let matrix = new THREE.Matrix4()
    let scale = random(r + 4)

    matrix.compose(
      // position
      new THREE.Vector3(Math.cos(direction) * distance, 0, Math.sin(direction) * distance),
      // rotation
      new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        (random(r + 5) - 0.5) * dv.length() * Math.PI * 2
      ),
      // scale
      new THREE.Vector3(scale * dv.x, scale * dv.y, scale * dv.z)
    )

    // merge with mother geometry
    geometry.merge(geo, matrix)
  }

  // convert geometry to buffergeometry
  let bufgeo = new THREE.BufferGeometry()
  bufgeo.fromGeometry(geometry)

  // setup material
  let material = new THREE.MeshLambertMaterial({
    color: new THREE.Color(environmentData.dressingColor),
    vertexColors: THREE.VertexColors,
  })

  // create mesh
  let mesh = new THREE.Mesh(bufgeo, material)
  dressingObj.add(mesh)
  dressing.setObject3D("mesh", dressingObj)

  // add to scene
  document.querySelector("a-scene").appendChild(dressing)
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
  // ground.setAttribute("scale", { z: environmentData.groundYScale })

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

  updateDressing()
}
