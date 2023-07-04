import { Vector3 } from '@TRE/math'
import { Color } from '@TRE/ray-tracer/color'
import { Material } from './material'

export class DiffuseLight extends Material {
  emitted(u: number, v: number, point: Vector3): Color {
    return this.texture.value(u, v, point)
  }
}
