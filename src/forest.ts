export default () => {
  let STAGE_SIZE = 200
  let TREE_COUNT = 500
  let seed = 8

  const random = (x: number) => {
    return parseFloat(
      "0." +
        Math.sin(seed * 9999 * x)
          .toString()
          .substr(7)
    )
  }

  for (let i = 0, r = 88343; i < TREE_COUNT; i++, r++) {
    // set random position, rotation and scale
    let dv = new THREE.Vector3(10, 10, 10)

    // No trees on play area
    let distance = 10 + Math.max(dv.x, dv.z) + 10 * random(r + 1) + (random(r + 2) * STAGE_SIZE) / 3

    let direction = random(r + 3) * Math.PI * 2
    let scale = random(r + 4)

    let tree = document.createElement("a-tree")
    tree.setAttribute("pos", Math.cos(direction) * distance + " " + Math.sin(direction) * distance)
    tree.setAttribute("scle", scale)

    document.querySelector("a-scene").appendChild(tree)
  }
}
