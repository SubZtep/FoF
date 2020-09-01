import { DetailEvent, Entity } from "aframe"

AFRAME.registerComponent("audio-listener", {
  init() {
    let sceneEl = this.el.sceneEl
    let listener: THREE.AudioListener = sceneEl.audioListener || new THREE.AudioListener()
    sceneEl.audioListener = listener

    if (listener.context.state === "suspended") {
      // The AudioContext was not allowed to start. It must be resumed (or created)
      // after a user gesture on the page. https://goo.gl/7K7WLu
      ;["click", "keypress"].forEach(type =>
        document.addEventListener(
          type,
          () => {
            listener.context.resume()
          },
          { once: true }
        )
      )
      listener.context.addEventListener("statechange", this.contextActive.bind(this), { once: true })
    } else {
      this.contextActive()
    }
  },

  contextActive() {
    let sceneEl = this.el.sceneEl
    sceneEl.addEventListener("camera-set-active", this.toCam.bind(this))
    if (sceneEl.camera) {
      sceneEl.dispatchEvent(new CustomEvent("camera-set-active", { detail: { cameraEl: sceneEl.camera.el } }))
    }
  },

  toCam(evt: DetailEvent<{ cameraEl: Entity<THREE.Camera> }>) {
    let sceneEl = this.el.sceneEl
    evt.detail.cameraEl.getObject3D("camera").add(sceneEl.audioListener)
    sceneEl.emit("audio-listener-active", sceneEl.audioListener)
  },

  remove() {
    this.el.sceneEl.removeEventListener("camera-set-active", this.toCam)
  },
})
