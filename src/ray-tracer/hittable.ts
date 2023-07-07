import { Vector3 } from '@TRE/math'
import { Ray } from '@TRE/primitive/ray'
import { Material, LambertianMaterial } from '@TRE/ray-tracer/materials'
import { Color } from '@TRE/ray-tracer/color'

export interface HitRecord {
  point: Vector3
  normal: Vector3
  t: number
  frontFace: boolean
  material?: Material
  pdf?: number
  // texture coordinates
  u?: number
  v?: number
}

export interface HitResult {
  doesHit: boolean
  hitRecord?: HitRecord
}

export const getFaceNormal = (r: Ray, outwardNormal: Vector3) => {
  const frontFace: boolean = Vector3.dotProduct(r.dir, outwardNormal) < 0
  const normal = frontFace ? outwardNormal : outwardNormal.negate()

  return { frontFace, normal }
}

export class Hittable {
  // each object should define its own bounding volume
  bv: any
  // default to be a gray lambertian material
  material: Material = new LambertianMaterial()

  hit(r: Ray, tMin: number, tMax: number): HitResult {
    return { doesHit: false }
  }

  setMaterial(material: Material) {
    this.material = material
  }

  pdfValue(point: Vector3, dir: Vector3): number {
    return 0
  }

  random(point: Vector3): Vector3 {
    return new Vector3(1, 0, 0)
  }
}
