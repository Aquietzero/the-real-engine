import { Vector3 } from './vector3'

export class Quaternion {
  public x: number = 0
  public y: number = 0
  public z: number = 0
  public w: number = 0

  constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
    this.x = x
    this.y = y
    this.z = z
    this.w = w
  }

  public toVector(): Vector3 {
    return new Vector3(this.x, this.y, this.z)
  }

  public add(q: Quaternion): Quaternion {
    return new Quaternion(
      this.x + q.x,
      this.y + q.y,
      this.z + q.z,
      this.w + q.w,
    )
  }

  public sub(q: Quaternion): Quaternion {
    return new Quaternion(
      this.x - q.x,
      this.y - q.y,
      this.z - q.z,
      this.w - q.w,
    )
  }

  public scalarMul(s: number) {
    return new Quaternion(
      this.x * s,
      this.y * s,
      this.z * s,
      this.w * s,
    )
  }

  public mul(r: Quaternion): Quaternion {
    const qv = new Vector3(this.x, this.y, this.z)
    const rv = new Vector3(r.x, r.y, r.z)
    const v = Vector3.crossProduct(qv, rv)
      .add(qv.mul(r.w))
      .add(rv.mul(this.w))
    const w = this.w * r.w - Vector3.dotProduct(qv, rv)

    return new Quaternion(
      v.x, v.y, v.z, w
    )
  }

  public conjugate(): Quaternion {
    return new Quaternion(-this.x, -this.y, -this.z, this.w)
  }

  public norm(): number {
    const { x, y, z, w } = this
    return Math.sqrt(x*x + y*y + z*z + w*w)
  }

  public norm2(): number {
    const { x, y, z, w } = this
    return x*x + y*y + z*z + w*w
  }

  public normalize(): Quaternion {
    return this.scalarMul(this.norm())
  }

  public inverse(): Quaternion {
    return this.conjugate().scalarMul(1/this.norm2())
  }

  public static fromVector(v: Vector3): Quaternion {
    return new Quaternion(v.x, v.y, v.z, 0)
  }

  public static fromPoint(v: Vector3): Quaternion {
    return new Quaternion(v.x, v.y, v.z, 1)
  }

  public static fromAxisAngle(axis: Vector3, angle: number): Quaternion {
    const normAxis = axis.normalize()
    const sin = Math.sin(angle / 2)
    const cos = Math.cos(angle / 2)
    return new Quaternion(
      normAxis.x * sin,
      normAxis.y * sin,
      normAxis.z * sin,
      cos
    )
  }
}
