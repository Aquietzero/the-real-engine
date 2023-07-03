import { Vector3 } from '@TRE/math'
import { Ray } from '@TRE/primitive/ray'
import { HitRecord } from '@TRE/ray-tracer/hittable'
import { Color } from '@TRE/ray-tracer/color'
import { Texture } from '@TRE/ray-tracer/texture'

export class Material {
  scatter(rayIn: Ray, hitRecord: HitRecord) {}
}

interface LambertianMaterialOptions {
  albedo?: Color
}

export class LambertianMaterial extends Material {
  albedo: Color
  texture: Texture

  constructor(options: LambertianMaterialOptions) {
    super()
    this.albedo = options.albedo || new Color(0.8, 0.8, 0.8)
  }

  setTexture(texture: Texture) {
    this.texture = texture
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
    const scattered = new Ray(
      hitRecord.point,
      reflected.add(Vector3.randomInUnitSphere().mul(this.fuzz))
    )

    return {
      isValid: Vector3.dotProduct(scattered.dir, hitRecord.normal) > 0,
      scattered,
      attenuation: this.albedo,
    }
  }
}

interface DielectricMaterialOptions {
  refractiveIndex: number
}

export class DielectricMaterial extends Material {
  refractiveIndex: number = 0

  constructor(options: DielectricMaterialOptions) {
    super()
    this.refractiveIndex = options.refractiveIndex
  }

  scatter(rayIn: Ray, hitRecord: HitRecord) {
    const attenuation = new Color(1, 1, 1)
    const refractionRatio = hitRecord.frontFace
      ? 1 / this.refractiveIndex
      : this.refractiveIndex

    const unitDirection = rayIn.dir.normalize()
    const cosTheta = Math.min(
      Vector3.dotProduct(unitDirection.negate(), hitRecord.normal),
      1
    )
    const sinTheta = Math.sqrt(1 - cosTheta * cosTheta)

    const cannotRefract = refractionRatio * sinTheta > 1
    let dir

    if (
      cannotRefract ||
      DielectricMaterial.reflectance(cosTheta, this.refractiveIndex) >
        Math.random()
    ) {
      dir = Vector3.reflect(unitDirection, hitRecord.normal)
    } else {
      dir = Vector3.refract(unitDirection, hitRecord.normal, refractionRatio)
    }

    const scattered = new Ray(hitRecord.point, dir)

    return {
      isValid: true,
      scattered,
      attenuation,
    }
  }

  private static reflectance(cosine: number, refractiveIndex: number) {
    let r0 = (1 - refractiveIndex) / (1 + refractiveIndex)
    r0 = r0 * r0
    return r0 + (1 - r0) * Math.pow(1 - cosine, 5)
  }
}
