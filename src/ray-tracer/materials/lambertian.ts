import { Vector3 } from '@TRE/math'
import { Ray } from '@TRE/primitive/ray'
import { HitRecord } from '@TRE/ray-tracer/hittable'
import { Color } from '@TRE/ray-tracer/color'
import { Texture } from '@TRE/ray-tracer/texture'
import { Material } from './material'

interface LambertianMaterialOptions {
  albedo?: Color
}

export class LambertianMaterial extends Material {
  albedo: Color

  constructor(options: LambertianMaterialOptions) {
    super()
    this.albedo = options.albedo || new Color(0.8, 0.8, 0.8)
  }

  scatter(rayIn: Ray, hitRecord: HitRecord) {
    let scatterDirection = hitRecord.normal.add(Vector3.randomUnitVector())

    if (scatterDirection.isZero()) {
      scatterDirection = hitRecord.normal
    }

    const scattered = new Ray(hitRecord.point, scatterDirection)

    return {
      isValid: true,
      scattered,
      attenuation: this.texture
        ? this.texture.value(hitRecord.u, hitRecord.v, hitRecord.point)
        : this.albedo,
    }
  }
}
