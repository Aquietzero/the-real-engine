import { Vector3 } from '@TRE/math'
import { Ray } from '@TRE/primitive/ray'
import { HitResult, Hittable, getFaceNormal } from '@TRE/ray-tracer/hittable'
import { AABB } from '@TRE/bounding-volumes'

export class XYRect extends Hittable {
  x0: number
  x1: number
  y0: number
  y1: number
  k: number

  bv: AABB

  constructor(x0: number, x1: number, y0: number, y1: number, k: number) {
    super()
    this.x0 = x0
    this.x1 = x1
    this.y0 = y0
    this.y1 = y1
    this.k = k

    this.bv = new AABB(
      new Vector3((x0 + x1) / 2, (y0 + y1) / 2, k),
      new Vector3(Math.abs(x0 - x1) / 2, Math.abs(y0 - y1) / 2, 0.000001)
    )
  }

  hit(r: Ray, tMin: number = 0, tMax: number = Infinity): HitResult {
    const t = (this.k - r.p.z) / r.dir.z
    if (t < tMin || t > tMax) return { doesHit: false }

    const x = r.p.x + t * r.dir.x
    const y = r.p.y + t * r.dir.y
    if (x < this.x0 || x > this.x1 || y < this.y0 || y > this.y1)
      return { doesHit: false }

    const outwardNormal = new Vector3(0, 0, 1)
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
        v: (y - this.y0) / (this.y1 - this.y0),
      },
    }
  }
}
