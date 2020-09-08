// https://burakkanber.com/blog/modeling-physics-javascript-gravity-and-drag/
import { Vector3 } from "super-three/src/math/Vector3"

AFRAME.registerComponent("bouncy", {
  schema: {
    width: {
      default: 5,
    },
    // ball
    velocity: {
      type: "vec2",
      default: { x: 0.03, y: 0 },
    },
    mass: {
      default: 0.1, //kg
    },
    radius: {
      default: 0.2, // 1px = 1cm
    },
    restitution: {
      default: -0.7,
    },
    // physics
    Cd: {
      default: 0.47, // Dimensionless, coefficient of drag (ball: 0.47)
    },
    rho: {
      default: 0.122, // kg / m^3
    },
    A: {
      // default: Math.PI * ball.radius * ball.radius / (10000); // m^2
      default: 0,
    },
    ag: {
      default: -9.81, // m / s^2
    },
  },

  init() {
    // this.tick = AFRAME.utils.throttleTick(this.tick, 100, this)
    let { data } = this
    data.A = (Math.PI * data.radius * data.radius) / 10000 // m^2
  },

  tick(time: number, delta: number) {
    // this.el.object3D.rotation.y += 0.01 * delta
    let { data } = this

    // Drag force: Fd = -1/2 * Cd * A * rho * v * v
    let Fx =
      (-0.5 * data.Cd * data.A * data.rho * data.velocity.x * data.velocity.x * data.velocity.x) /
      Math.abs(data.velocity.x)
    let Fy =
      (-0.5 * data.Cd * data.A * data.rho * data.velocity.y * data.velocity.y * data.velocity.y) /
      Math.abs(data.velocity.y)

    Fx = isNaN(Fx) ? 0 : Fx
    Fy = isNaN(Fy) ? 0 : Fy

    // Calculate acceleration ( F = ma )
    let ax = Fx / data.mass
    let ay = data.ag + Fy / data.mass

    //

    let pos: Vector3 = this.el.object3D.position,
      vel = data.velocity

    // Integrate to get velocity
    vel.x += ax * 0.001
    vel.y += ay * 0.001

    // Integrate to get position
    pos.x += vel.x * delta * 0.1
    pos.y += vel.y * delta * 0.1

    // Wall hit
    if (pos.y < data.radius) {
      vel.y *= data.restitution
      pos.y = data.radius
    }
    if (pos.x > data.width) {
      vel.x *= data.restitution
      pos.x = data.width - data.radius
    }
    if (pos.x < -data.width) {
      vel.x *= data.restitution
      pos.x = -data.width + data.radius
    }
  },
})
