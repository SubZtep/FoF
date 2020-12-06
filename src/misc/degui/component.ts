/**
 * Doc: https://aframe.io/docs/1.1.0/components/renderer.html
 */

AFRAME.registerComponent("degui-renderer", {
  schema: {
    localStorageKey: { default: "degui-renderer" },
  },

  init() {
    const rendererAttribute = this.el.getAttribute("renderer")
    Object.freeze(rendererAttribute)
    const rendererKeys = Object.keys(rendererAttribute)
    let config: { [key: string]: any } = Object.assign(
      { autoReload: false },
      rendererAttribute,
      JSON.parse(window.localStorage.getItem(this.data.localStorageKey)) || {}
    )

    if (typeof config.antialias !== "boolean") {
      config.antialias = AFRAME.utils.device.isMobile()
    }
    if (typeof config.logarithmicDepthBuffer !== "boolean") {
      config.logarithmicDepthBuffer = false
    }

    // @ts-ignore
    const gui = this.el.sceneEl.systems.degui.gui as dat.GUI
    const sf = gui.addFolder("A-Scene WebGL Renderer (reload for refresh)")
    sf.open()

    const setRenderer = () =>
      this.el.setAttribute("renderer", rendererKeys.map(key => `${key}: ${config[key].toString()}`).join("; "))

    const onChangeHandler = () => {
      window.localStorage.setItem(this.data.localStorageKey, JSON.stringify(config))
      if (config.autoReload) {
        location.reload()
      } else {
        setRenderer()
      }
    }

    const descriptions = {
      antialias: "Whether to perform antialiasing. If auto, antialiasing is disabled on mobile.",
      colorManagement: "Whether to use a color-managed linear workflow.",
      highRefreshRate: "Toggles 72hz mode on Oculus Browser. Defaults to 60hz.",
      foveationLevel: "Enables foveation in VR to improve perf. 0 none, 1 low, 2 medium, 3 high",
      sortObjects: "Whether to sort objects before rendering.",
      physicallyCorrectLights: "Whether to use physically-correct light attenuation.",
      maxCanvasWidth:
        "Maximum canvas width. Uses the size multiplied by device pixel ratio. Does not limit canvas width if set to -1.",
      maxCanvasHeight: "Maximum canvas height. Behaves the same as maxCanvasWidth.",
      logarithmicDepthBuffer: "Whether to use a logarithmic depth buffer.",
      precision: "Fragment shader precision : low, medium or high.",
      alpha: "Whether the canvas should contain an alpha buffer.",
    }

    Object.keys(config).forEach(key => {
      let controller: dat.GUIController

      switch (key) {
        case "maxCanvasWidth":
        case "maxCanvasHeight":
          controller = sf.add(config, key).min(1024).max(4096)
          break
        case "precision":
          controller = sf.add(config, key, ["low", "medium", "high"])
          break
        case "foveationLevel":
          controller = sf.add(config, key).min(0).max(3).step(1)
          break
        default:
          controller = sf.add(config, key)
      }

      controller
        .name(key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^([a-z]{1})/, c => c.toUpperCase()))
        .onFinishChange(onChangeHandler)

      if (key === "autoReload") {
        sf.add(location, "reload").name("Reload Browser Window Now!")
      }

      const desc = descriptions[key]
      if (desc !== undefined) {
        // @ts-ignore
        controller.title(desc)
      }
    })

    sf.add(
      {
        reset() {
          config = Object.assign(config, { autoReload: false }, rendererAttribute)
          gui.updateDisplay()
          onChangeHandler()
        },
      },
      "reset"
    ).name("Reset to Default")

    setRenderer()
  },
})
