import { Vector3 } from '@TRE/math'
import { Ray } from '@TRE/primitive/ray'
import { HitResult, Hittable, getFaceNormal } from '@TRE/ray-tracer/hittable'
import { AABB } from '@TRE/bounding-volumes'

export class YZRect extends Hittable {
  y0: number
  y1: number
  z0: number
  z1: number
  k: number

  bv: AABB

  constructor(y0: number, y1: number, z0: number, z1: number, k: number) {
    super()
    this.y0 = y0
    this.y1 = y1
    this.z0 = z0
    this.z1 = z1
    this.k = k

    this.bv = new AABB(
      new Vector3(k, (y0 + y1) / 2, (z0 + z1) / 2),
      new Vector3(0.000001, Math.abs(y0 - y1) / 2, Math.abs(z0 - z1) / 2)
    )
  }

  hit(r: Ray, tMin: number = 0, tMax: number = Infinity): HitResult {
    const t = (this.k - r.p.x) / r.dir.x
    if (t < tMin || t > tMax) return { doesHit: false }

    const y = r.p.y + t * r.dir.y
    const z = r.p.z + t * r.dir.z
    if (y < this.y0 || y > this.y1 || z < this.z0 || z > this.z1)
      return { doesHit: false }

    const outwardNormal = new Vector3(1, 0, 0)
    const { frontFace, normal } = getFaceNormal(r, outwardNormal)

    return {
      doesHit: true,
      hitRecord: {
        t,
        point: r.parametric(t),
        normal,
        frontFace,
        material: this.material,
        u: (y - this.y0) / (this.y1 - this.y0),
        v: (z - this.z0) / (this.z1 - this.z0),
      },
    }
  }
}
