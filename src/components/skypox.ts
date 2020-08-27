AFRAME.registerComponent("skypox", {
  init() {
    var distance = 100
    var geometry = new THREE.Geometry()

    for (var i = 0; i < 1000; i++) {
      var vertex = new THREE.Vector3()

      // @ts-ignore
      var theta = THREE.Math.randFloatSpread(360)
      // @ts-ignore
      var phi = THREE.Math.randFloatSpread(360)

      vertex.x = distance * Math.sin(theta) * Math.cos(phi)
      vertex.y = distance * Math.sin(theta) * Math.sin(phi)
      vertex.z = distance * Math.cos(theta)

      geometry.vertices.push(vertex)
    }
    var particles = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        color: 0x8a0707,
        size: 1,
        sizeAttenuation: false,
      })
    )
    // @ts-ignore
    particles.boundingSphere = 120

    this.el.sceneEl.object3D.add(particles)
  },
})
