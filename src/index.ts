//import { getAudioBuffer } from "./audio/audio"
import updateGround from "./ground"
import "./systems/forest"
import "./components/tree-primitive"
import "./components/tree-pythagoras"
import "./components/sound"

window.onload = () => {
  updateGround()
  // deployForest()
  // loadBeat()
  //let buffer = await getAudioBuffer()
  //let sound = document.createElement("a-sound")
  // sound.setAttribute("src", buffer)
  // document.querySelector("a-scene").object3D.add(new THREE.AxesHelper())
}
