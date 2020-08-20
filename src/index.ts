//import { getAudioBuffer } from "./audio/audio"
import updateGround from "./ground"
import deployForest from "./forest"
import "./components/tree"
import "./components/sound"

window.onload = () => {
  updateGround()
  deployForest()
  // loadBeat()

  //let buffer = await getAudioBuffer()
  //let sound = document.createElement("a-sound")

  // sound.setAttribute("src", buffer)
  // document.querySelector("a-scene").appendChild(sound)
}
