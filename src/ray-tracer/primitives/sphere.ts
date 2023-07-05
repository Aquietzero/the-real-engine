import { Vector3 } from '@TRE/math'
import { Ray } from '@TRE/primitive/ray'
import { HitResult, Hittable, getFaceNormal } from '@TRE/ray-tracer/hittable'
import { LambertianMaterial } from '@TRE/ray-tracer/materials'
import { AABB } from '@TRE/bounding-volumes'

export class Sphere extends Hittable {
  center: Vector3
  radius: number

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

  hit(r: Ray, tMin: number = 0, tMax: number = Infinity): HitResult {
    const oc = r.p.sub(this.center)
    const a = Vector3.dotProduct(r.dir, r.dir)
    const halfB = Vector3.dotProduct(oc, r.dir)
    const c = oc.len2() - this.radius * this.radius
    const discriminant = halfB * halfB - a * c

    if (discriminant < 0) return { doesHit: false }

    const sqrtd = Math.sqrt(discriminant)
    let root = (-halfB - sqrtd) / a
    if (root < tMin || tMax < root) {
      root = (-halfB + sqrtd) / a
      if (root < tMin || tMax < root) {
        return { doesHit: false }
      }
    }

    const hitPoint = r.parametric(root)
    const outwardNormal = hitPoint.sub(this.center).div(this.radius)
    const { frontFace, normal } = getFaceNormal(r, outwardNormal)
    const { u, v } = Sphere.getSphereUV(outwardNormal)
    return {
      doesHit: true,
      hitRecord: {
        t: root,
        point: hitPoint,
        normal,
        frontFace,
        material: this.material,
        u,
        v,
      },
    }
  }

  static getSphereUV(point: Vector3) {
    const theta = Math.acos(-point.y)
    const phi = Math.atan2(-point.z, point.x) + Math.PI

    const u = phi / (2 * Math.PI)
    const v = theta / Math.PI

    return { u, v }
  }
}
