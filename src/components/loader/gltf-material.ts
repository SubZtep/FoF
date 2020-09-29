import { GLTFLoader } from "super-three/examples/jsm/loaders/GLTFLoader"

AFRAME.registerComponent("gltf-material", {
  init() {
    var loader = new GLTFLoader()
    loader.load(
      "assets/materials/forest/forest_floor_material/scene.gltf",
      gltf => {
        var parser = gltf.parser
        parser.getDependency("material", 0).then(material => {
          console.log("MAT", material)
          const repeat = { x: 100, y: 100 }
          material.map.repeat = repeat
          material.metalnessMap.repeat = repeat
          material.normalMap.repeat = repeat

          this.el.getObject3D("mesh").material = material
        })
      },
      undefined,
      e => console.error("ERROR", e)
    )
  },
})
