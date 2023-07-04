import { Vector3 } from '@TRE/math'
import { Color } from '@TRE/ray-tracer/color'

export class Texture {
  value(u: number, v: number, point: Vector3): Color {
    return new Color(0, 0, 0)
  }
}

export class SolidColor extends Texture {
  color: Color

  constructor(c: Color) {
    super()
    this.color = c
  }

  value(u: number, v: number, point: Vector3): Color {
    return this.color
  }
}

export class CheckerTexture extends Texture {
  odd: Texture
  even: Texture
  step: number

  constructor(odd: Texture, even: Texture, step: number = 10) {
    super()
    this.odd = odd
    this.even = even
    this.step = step
  }

  value(u: number, v: number, point: Vector3): Color {
    const sines =
      Math.sin(this.step * point.x) *
      Math.sin(this.step * point.y) *
      Math.sin(this.step * point.z)
    if (sines < 0) {
      return this.odd.value(u, v, point)
    }
    return this.even.value(u, v, point)
  }
}
