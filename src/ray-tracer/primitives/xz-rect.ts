import { Vector3 } from '@TRE/math'
import { Ray } from '@TRE/primitive/ray'
import { HitResult, Hittable, getFaceNormal } from '@TRE/ray-tracer/hittable'
import { LambertianMaterial } from '@TRE/ray-tracer/materials'
import { AABB } from '@TRE/bounding-volumes'

export class XZRect extends Hittable {
  x0: number
  x1: number
  z0: number
  z1: number
  k: number

  bv: AABB

  constructor(x0: number, x1: number, z0: number, z1: number, k: number) {
    super()
    this.x0 = x0
    this.x1 = x1
    this.z0 = z0
    this.z1 = z1
    this.k = k

    this.bv = new AABB(
      new Vector3((x0 + x1) / 2, k, (z0 + z1) / 2),
      new Vector3(Math.abs(x0 - x1) / 2, 0.000001, Math.abs(z0 - z1) / 2)
    )
  }

  hit(r: Ray, tMin: number = 0, tMax: number = Infinity): HitResult {
    const t = (this.k - r.p.y) / r.dir.y
    if (t < tMin || t > tMax) return { doesHit: false }

    const x = r.p.x + t * r.dir.x
    const z = r.p.z + t * r.dir.z
    if (x < this.x0 || x > this.x1 || z < this.z0 || z > this.z1)
      return { doesHit: false }

    const outwardNormal = new Vector3(0, 1, 0)
    const { frontFace, normal } = getFaceNormal(r, outwardNormal)

    return {
      doesHit: true,
      hitRecord: {
        t,
        point: r.parametric(t),
        normal,
        frontFace,
        material: this.material,
        u: (x - this.x0) / (this.x1 - this.x0),
        v: (z - this.z0) / (this.z1 - this.z0),
      },
    }
  }
}
