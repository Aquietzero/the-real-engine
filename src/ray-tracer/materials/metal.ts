import { Vector3 } from '@TRE/math'
import { Ray } from '@TRE/primitive/ray'
import { HitRecord } from '@TRE/ray-tracer/hittable'
import { Color } from '@TRE/ray-tracer/color'
import { Material } from './material'

interface MetalMaterialOptions {
  albedo: Color
  fuzz: number
}

export class MetalMaterial extends Material {
  albedo: Color
  fuzz: number = 0

  constructor(options: MetalMaterialOptions) {
    super()
    this.albedo = options.albedo || new Color(0.8, 0.8, 0.8)
    this.fuzz = options.fuzz || 0
  }

  scatter(rayIn: Ray, hitRecord: HitRecord) {
    const reflected = Vector3.reflect(rayIn.dir.normalize(), hitRecord.normal)
    const specularRay = new Ray(
      hitRecord.point,
      reflected.add(Vector3.randomInUnitSphere().mul(this.fuzz))
    )

    return {
      isValid: true,
      isSpecular: true,
      specularRay,
      attenuation: this.albedo,
    }
  }
}
