//import { getAudioBuffer } from "./audio/audio"
import "./systems/ground"
import "./systems/forest"
import "./components/tree-primitive"
import "./components/tree-pythagoras"
import "./components/sound"

window.onload = () => {
  setTimeout(() => {
    document.querySelector("a-scene").emit("makeEarthFlat")
  }, 5000)

  setTimeout(() => {
    document.querySelector("a-scene").emit("makeEarthGreen")
  }, 8000)
}
