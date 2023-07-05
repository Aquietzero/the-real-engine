import { Vector3 } from '@TRE/math'
import { Ray } from '@TRE/primitive/ray'
import { HitRecord } from '@TRE/ray-tracer/hittable'
import { Color } from '@TRE/ray-tracer/color'
import { Texture, SolidColor } from '@TRE/ray-tracer/texture'
import { Material } from './material'

interface LambertianMaterialOptions {
  texture?: Texture
}

export class LambertianMaterial extends Material {
  constructor(options: LambertianMaterialOptions = {}) {
    super()
    this.texture = options.texture || new SolidColor(new Color(0.8, 0.8, 0.8))
  }

  scatter(rayIn: Ray, hitRecord: HitRecord) {
    let scatterDirection = hitRecord.normal.add(Vector3.randomUnitVector())

    if (scatterDirection.isZero()) {
      scatterDirection = hitRecord.normal
    }

    return {
      isValid: true,
      scattered: new Ray(hitRecord.point, scatterDirection),
      attenuation: this.texture.value(
        hitRecord.u,
        hitRecord.v,
        hitRecord.point
      ),
    }
  }
}
