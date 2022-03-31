// Vector in 3d Euclidean space.
export class Vector3 {
  public x: number = 0
  public y: number = 0
  public z: number = 0

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x
    this.y = y
    this.z = z
  }

  public set(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
  }

  public clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z)
  }

  public isZero(): boolean {
    return this.x === 0 && this.y === 0 && this.z === 0
  }

  public equals(v: Vector3): boolean {
    return this.x === v.x && this.y === v.y && this.z === v.z
  }

  public add(v: Vector3): Vector3 {
    return new Vector3(
      this.x + v.x,
      this.y + v.y,
      this.z + v.z
    )
  }

  public sub(v: Vector3): Vector3 {
    return new Vector3(
      this.x - v.x,
      this.y - v.y,
      this.z - v.z
    )
  }

  public mul(s: number): Vector3 {
    return new Vector3(
      this.x * s,
      this.y * s,
      this.z * s
    )
  }

  public div(s: number): Vector3 {
    if (s === 0) throw Error('[Vector3.div]: cannot divide 0')
    return new Vector3(
      this.x / s,
      this.y / s,
      this.z / s
    )
  }

  public negate(): Vector3 {
    return new Vector3(-this.x, -this.y, -this.z)
  }

  public len(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
  }

  // squared length of the vector
  public len2(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z
  }

  public normalize(): Vector3 {
    const len = this.len()
    if (len === 0) return

    return new Vector3(
      this.x / len,
      this.y / len,
      this.z / len
    )
  }

  public static dotProduct(v1: Vector3, v2: Vector3): number {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z
  }

  public static crossProduct(v1: Vector3, v2: Vector3): Vector3 {
    const cp = new Vector3(
      v1.y * v2.z - v1.z * v2.y,
      v1.z * v2.x - v1.x * v2.z,
      v1.x * v2.y - v1.y * v2.x,
    )

    if (cp.isZero()) return Y_AXIS
    return cp
  }

  // return the angle between two given vectors by radians.
  public static angleBetween(v1: Vector3, v2: Vector3): number {
    return Math.acos(Vector3.dotProduct(v1, v2) / (v1.len() * v2.len()))
  }
}

export const X_AXIS_UNIT = new Vector3(1, 0, 0)
export const Y_AXIS_UNIT = new Vector3(0, 1, 0)
export const Z_AXIS_UNIT = new Vector3(0, 0, 1)
export const X_AXIS = X_AXIS_UNIT
export const Y_AXIS = Y_AXIS_UNIT
export const Z_AXIS = Z_AXIS_UNIT
