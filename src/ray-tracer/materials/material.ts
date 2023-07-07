import { Vector3 } from '@TRE/math'
import { Ray } from '@TRE/primitive/ray'
import { HitRecord } from '@TRE/ray-tracer/hittable'
import { Color } from '@TRE/ray-tracer/color'
import { Texture } from '@TRE/ray-tracer/texture'

export class Material {
  texture: Texture

  setTexture(texture: Texture) {
    this.texture = texture
  }

  scatter(rayIn: Ray, hitRecord: HitRecord) {
    return { isValid: false }
  }

  scatteringPDF(rayIn: Ray, hitRecord: HitRecord, scattered: Ray) {
    return 0
  }

  emitted(u: number, v: number, point: Vector3): Color {
    return new Color(0, 0, 0)
  }
}
