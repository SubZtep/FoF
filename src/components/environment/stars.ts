AFRAME.registerComponent("stars", {
  schema: {
    distance: {
      default: 80,
    },
    color: {
      type: "color",
      default: "#daa520",
    },
    size: {
      default: 2.5,
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
      // @ts-ignore
      theta = THREE.Math.randFloatSpread(360)
      // @ts-ignore
      phi = THREE.Math.randFloatSpread(360)

      geometry.vertices.push(
        new THREE.Vector3(
          data.distance * Math.sin(theta) * Math.cos(phi),
          Math.abs(data.distance * Math.sin(theta) * Math.sin(phi)),
          data.distance * Math.cos(theta)
        )
      )
    }

    // this.color = new THREE.Color(data.color)
    // color.convertSRGBToLinear()

    this.m = new THREE.PointsMaterial({
      fog: false,
      // color: this.color,
      // size: data.size,
      sizeAttenuation: false,
    })

    this.ps = new THREE.Points(geometry, this.m)

    // @ts-ignore
    this.ps.boundingSphere = 120

    this.el.setObject3D("stars", this.ps)
  },

  update() {
    this.color = new THREE.Color(this.data.color)
    this.m.setValues({
      color: this.color,
      size: this.data.size,
    })
  },
})
