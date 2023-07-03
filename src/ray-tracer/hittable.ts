import { Vector3 } from '@TRE/math'
import { Ray } from '@TRE/primitive/ray'
import { Material } from '@TRE/ray-tracer/material'

export interface HitRecord {
  point: Vector3
  normal: Vector3
  t: number
  frontFace: boolean
  material?: Material
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

  hit(r: Ray, tMin: number, tMax: number): HitResult {
    return { doesHit: false }
  }
}
