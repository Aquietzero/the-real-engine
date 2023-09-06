import { Vector3, ONB } from '@TRE/math'
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

  pdfValue(point: Vector3, dir: Vector3): number {
    const hitTest = this.hit(new Ray(point, dir))
    if (!hitTest.doesHit) return 0

    const cosThetaMax = Math.sqrt(
      1 - (this.radius * this.radius) / this.center.sub(point).len2()
    )
    const solidAngle = 2 * Math.PI * (1 - cosThetaMax)
    return 1 / solidAngle
  }

  random(point: Vector3): Vector3 {
    const dir = this.center.sub(point)
    const distanceSquared = dir.len2()
    const uvw = new ONB()
    uvw.buildFromW(dir)
    return uvw.local(Vector3.randomToSphere(this.radius, distanceSquared))
  }

  static getSphereUV(point: Vector3) {
    const theta = Math.acos(-point.y)
    const phi = Math.atan2(-point.z, point.x) + Math.PI

    const u = phi / (2 * Math.PI)
    const v = theta / Math.PI

    return { u, v }
  }
}
