import { Vector3 } from '@TRE/math'
import { clamp } from '@TRE/ray-tracer/utils'

export class Color extends Vector3 {
  get r() {
    return this.x
  }

  get g() {
    return this.y
  }

  get b() {
    return this.z
  }

  static random() {
    return new Color(Math.random(), Math.random(), Math.random())
  }
}

export const writeColor = (color: Color, scale: number) => {
  // sqrt: gamma correction
  let r = Math.sqrt(color.x * scale)
  let g = Math.sqrt(color.y * scale)
  let b = Math.sqrt(color.z * scale)

  r = 256 * clamp(r, 0, 1)
  g = 256 * clamp(g, 0, 1)
  b = 256 * clamp(b, 0, 1)

  return {
    r,
    g,
    b,
    str: `rgb(${r}, ${g}, ${b})`,
  }
}
