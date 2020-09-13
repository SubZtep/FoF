import { mergeBufferGeometries } from "../vendor.js"
import { Entity } from "aframe"
import { BufferGeometry } from "super-three/src/core/BufferGeometry"
import { random } from "../utils"

AFRAME.registerSystem("forest", {
  schema: {
    trees: { default: 20 },
    width: { default: 100 },
    gap: { default: 10 },
  },

  r: 88343, // for random

  init() {
    this.el.addEventListener("secretforest", this.deploy.bind(this), { once: true })
    // this.el.addEventListener("stateadded", this.deploy.bind(this), { once: true })
  },

  deploy() {
    let distance: number,
      direction: number,
      pool: any,
      pn: string,
      tree: Entity,
      i: number,
      { el, data } = this

    const nextPos = (): [number, number, number] => {
      let r = ++this.r
      distance = 30 * random(r + 1) + (random(r + 2) * this.data.width) / 3
      direction = random(r + 3) * Math.PI * 2
      return [Math.cos(direction) * distance, 0, Math.sin(direction) * distance]
    }

    for (pn of ["knot", "oak", "pine"]) {
      pool = el.components[`pool__${pn}`]

      if (pool.availableEls.length > 0) {
        let trees: BufferGeometry[] = []
        let e = pool.requestEntity()

        let m: THREE.Mesh<BufferGeometry> = e.getObject3D("mesh")
        let g = m.geometry

        for (i = 0; i < data.trees; i++) {
          trees.push(g.clone().translate(...nextPos()))
        }

        // let merged = THREE.BufferGeometryUtils.mergeBufferGeometries(trees)
        // @ts-ignore
        let merged = mergeBufferGeometries(trees)
        // merged.normalizeNormals()
        let ms = new THREE.Mesh(merged, m.material)

        let forest = document.createElement("a-entity")
        forest.setObject3D("mesh", ms)
        forest.setAttribute("class", "forest")
        el.appendChild(forest)

        // tree.addEventListener("loaded", (e: any) => {
        //   let trees: BufferGeometry[] = []

        //   let m: THREE.Mesh<BufferGeometry> = e.target.getObject3D("mesh")
        //   let g = m.geometry

        //   for (i = 0; i < data.trees; i++) {
        //     trees.push(g.clone().translate(...nextPos()))
        //   }

        //   // let merged = THREE.BufferGeometryUtils.mergeBufferGeometries(trees)
        //   // @ts-ignore
        //   let merged = mergeBufferGeometries(trees)
        //   // merged.normalizeNormals()
        //   let ms = new THREE.Mesh(merged, m.material)

        //   let forest = document.createElement("a-entity")
        //   forest.setObject3D("mesh", ms)
        //   forest.setAttribute("class", "forest")
        //   el.appendChild(forest)

        //   console.log(forest)
        // })

        pool.returnEntity(tree)
      }
    }
  },
})
