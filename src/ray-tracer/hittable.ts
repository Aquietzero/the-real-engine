import { Vector3 } from '@TRE/math'
import { AABB } from '@TRE/bounding-volumes'
import { Ray } from '@TRE/primitive/ray'
import { Material, LambertianMaterial } from '@TRE/ray-tracer/materials'

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

export class RotateY extends Hittable {
  hittable: Hittable
  sinTheta: number
  cosTheta: number
  hasBox: boolean
  aabb: AABB

  constructor(hittable: Hittable, angle: number) {
    super()

    const radians = (angle * Math.PI) / 180
    this.sinTheta = Math.sin(radians)
    this.cosTheta = Math.cos(radians)

    this.hittable = hittable
  }

  hit(r: Ray, tMin: number, tMax: number): HitResult {
    const origin = r.p.clone()
    const direction = r.dir.clone()

    origin.x = this.cosTheta * r.p.x - this.sinTheta * r.p.z
    origin.z = this.sinTheta * r.p.x + this.cosTheta * r.p.z

    direction.x = this.cosTheta * r.dir.x - this.sinTheta * r.dir.z
    direction.z = this.sinTheta * r.dir.x + this.cosTheta * r.dir.z

    const rotatedRay = new Ray(origin, direction)

    const hitResult = this.hittable.hit(rotatedRay, tMin, tMax)
    if (!hitResult.doesHit) return { doesHit: false }

    const hitRecord = hitResult.hitRecord
    const p = hitRecord.point.clone()
    const n = hitRecord.normal.clone()

    p.x = this.cosTheta * hitRecord.point.x + this.sinTheta * hitRecord.point.z
    p.z = -this.sinTheta * hitRecord.point.x + this.cosTheta * hitRecord.point.z

    n.x =
      this.cosTheta * hitRecord.normal.x + this.sinTheta * hitRecord.normal.z
    n.z =
      -this.sinTheta * hitRecord.normal.x + this.cosTheta * hitRecord.normal.z

    const { frontFace, normal } = getFaceNormal(rotatedRay, n)

    return {
      doesHit: true,
      hitRecord: {
        ...hitRecord,
        point: p,
        normal,
        frontFace,
      },
    }
  }
}

export class Translate extends Hittable {
  hittable: Hittable
  offset: Vector3

  constructor(hittable: Hittable, displacement: Vector3) {
    super()

    this.hittable = hittable
    this.offset = displacement
  }

  hit(r: Ray, tMin: number, tMax: number): HitResult {
    const movedRay = new Ray(r.p.sub(this.offset), r.dir)
    const hitResult = this.hittable.hit(movedRay, tMin, tMax)
    if (!hitResult.doesHit) return { doesHit: false }

    const hitRecord = hitResult.hitRecord
    const { frontFace, normal } = getFaceNormal(movedRay, hitRecord.normal)

    return {
      doesHit: true,
      hitRecord: {
        ...hitRecord,
        point: hitRecord.point.add(this.offset),
        normal,
        frontFace,
      },
    }
  }
}
