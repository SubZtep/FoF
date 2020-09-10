AFRAME.registerComponent("stars", {
  schema: {
    distance: {
      default: 50,
    },
    color: {
      type: "color",
      default: "#daa520",
    },
    size: {
      default: 3,
    },
    count: {
      default: 200,
    },
  },
  init() {
    let data = this.data,
      geometry = new THREE.Geometry(),
      theta: number,
      phi: number

    for (var i = 0; i < data.count; i++) {
      var vertex = new THREE.Vector3()

      // @ts-ignore
      theta = THREE.Math.randFloatSpread(360)
      // @ts-ignore
      phi = THREE.Math.randFloatSpread(360)

      vertex.x = data.distance * Math.sin(theta) * Math.cos(phi)
      vertex.y = Math.abs(data.distance * Math.sin(theta) * Math.sin(phi))
      vertex.z = data.distance * Math.cos(theta)

      geometry.vertices.push(vertex)
    }
    var particles = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        fog: false,
        color: data.color,
        size: data.size,
        sizeAttenuation: false,
      })
    )
    // @ts-ignore
    particles.boundingSphere = 120

    this.el.setObject3D("stars", particles)
  },
})
