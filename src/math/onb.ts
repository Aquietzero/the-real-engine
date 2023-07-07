import { Vector3 } from '@TRE/math'

// orthonormal basis
export class ONB {
  u: Vector3
  v: Vector3
  w: Vector3

  local(vector: Vector3): Vector3 {
    return this.u
      .mul(vector.x)
      .add(this.v.mul(vector.y))
      .add(this.w.mul(vector.z))
  }

  buildFromW(w: Vector3) {
    this.w = w.normalize()
    const a =
      Math.abs(this.w.x) > 0.9 ? new Vector3(0, 1, 0) : new Vector3(1, 0, 0)
    this.v = Vector3.crossProduct(this.w, a).normalize()
    this.u = Vector3.crossProduct(this.w, this.v)
  }
}
