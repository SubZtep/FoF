// https://blog.mozvr.com/water-ripples-with-vertex-shaders/

AFRAME.registerComponent("water", {
  init() {
    const mat = new THREE.MeshPhongMaterial({ color: 0x2288ff, shininess: 100 })

    mat.onBeforeCompile = shader => {
      shader.uniforms.time = { value: 0 }
      shader.vertexShader =
        `
          uniform float time;
      ` + shader.vertexShader

      const token = "#include <begin_vertex>"
      const customTransform = `
          vec3 transformed = vec3(position);
          float freq = 3.0;
          float amp = 0.1;
          float angle = (time + position.x)*freq;
          transformed.z += sin(angle)*amp;
      `
      shader.vertexShader = shader.vertexShader.replace(token, customTransform)
      this.matShader = shader
    }

    const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(20, 20, 100, 100), mat)
    plane.rotation.x = (-90 * Math.PI) / 180
    this.el.setObject3D("mesh", plane)
  },

  // tick(time) {
  //   if (this.matShader) {
  //     this.matShader.uniforms.time.value = time / 1000
  //   }
  // },
})
