import { Vector3 } from '@TRE/math'
import { Ray } from '@TRE/primitive/ray'
import { HitRecord } from '@TRE/ray-tracer/hittable'
import { Color } from '@TRE/ray-tracer/color'
import { Texture, SolidColor } from '@TRE/ray-tracer/texture'
import { Material, ScatterRecord } from './material'
import { CosinePDF } from '../pdf'

interface LambertianMaterialOptions {
  texture?: Texture
}

export class LambertianMaterial extends Material {
  constructor(options: LambertianMaterialOptions = {}) {
    super()
    this.texture = options.texture || new SolidColor(new Color(0.8, 0.8, 0.8))
  }

  scatter(rayIn: Ray, hitRecord: HitRecord): ScatterRecord {
    return {
      isValid: true,
      isSpecular: false,
      pdf: new CosinePDF(hitRecord.normal),
      attenuation: this.texture.value(
        hitRecord.u,
        hitRecord.v,
        hitRecord.point
      ),
    }

    // random hemisphere sampling
    // let scatterDirection = Vector3.randomInHemisphere(hitRecord.normal)

    // const scattered = new Ray(hitRecord.point, scatterDirection.normalize())
    // return {
    //   isValid: true,
    //   scattered,
    //   pdf: 0.5 / Math.PI,
    //   attenuation: this.texture.value(
    //     hitRecord.u,
    //     hitRecord.v,
    //     hitRecord.point
    //   ),
    // }
  }

  scatteringPDF(rayIn: Ray, hitRecord: HitRecord, scattered: Ray) {
    const cosine = Vector3.dotProduct(
      hitRecord.normal,
      scattered.dir.normalize()
    )
    return cosine < 0 ? 0 : cosine / Math.PI
  }
}
