import { Vector3 } from '@TRE/math'
import { Ray } from '@TRE/primitive/ray'
import { HitResult, Hittable, getFaceNormal } from '@TRE/ray-tracer/hittable'
import { Material } from '@TRE/ray-tracer/material'
import { AABB } from '@TRE/bounding-volumes'

export class Sphere extends Hittable {
  center: Vector3
  radius: number
  material: Material

  bv: AABB

  constructor(center: Vector3, radius: number) {
    super()

    this.center = center
    this.radius = radius

    this.bv = new AABB(
      this.center.clone(),
      new Vector3(this.radius, this.radius, this.radius)
    )
  }

  setMaterial(material: Material) {
    this.material = material
  }

  hit(r: Ray, tMin: number = 0, tMax: number = Infinity): HitResult {
    const oc = r.p.sub(this.center)
    const a = Vector3.dotProduct(r.dir, r.dir)
    const b = 2 * Vector3.dotProduct(oc, r.dir)
    const c = Vector3.dotProduct(oc, oc) - this.radius * this.radius
    const discriminant = b * b - 4 * a * c

    if (discriminant < 0) return { doesHit: false }

    const sqrtd = Math.sqrt(discriminant)
    let root = (-b - sqrtd) / (2 * a)
    if (root < tMin || tMax < root) {
      root = (-b + sqrtd) / (2 * a)
      if (root < tMin || tMax < root) {
        return { doesHit: false }
      }
    }

    const hitPoint = r.parametric(root)
    const outwardNormal = hitPoint.sub(this.center).mul(1 / this.radius)
    const { frontFace, normal } = getFaceNormal(r, outwardNormal)
    return {
      doesHit: true,
      hitRecord: {
        t: root,
        point: hitPoint,
        normal,
        frontFace,
        material: this.material,
      },
    }
  }
}
