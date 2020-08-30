import { DetailEvent, Entity } from "aframe"

AFRAME.registerComponent("audio-listener", {
  init() {
    const sceneEl = this.el.sceneEl
    const listener: THREE.AudioListener = sceneEl.audioListener || new THREE.AudioListener()
    sceneEl.audioListener = listener

    if (sceneEl.camera) {
      sceneEl.camera.add(listener)
      sceneEl.emit("audio-listener-active", sceneEl.audioListener)
    }

    // Wait for camera if necessary.
    sceneEl.addEventListener("camera-set-active", this.addListenerToCamera)
  },

  addListenerToCamera(evt: DetailEvent<{ cameraEl: Entity<THREE.Camera> }>) {
    const sceneEl = this.el.sceneEl
    evt.detail.cameraEl.getObject3D("camera").add(sceneEl.audioListener)
    sceneEl.emit("audio-listener-active", sceneEl.audioListener)
  },

  remove() {
    this.el.sceneEl.removeEventListener("camera-set-active", this.addListenerToCamera)
  },
})
