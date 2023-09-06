import { random } from 'lodash'
import { Matrix4 } from './matrix4'

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
    return (
      Math.abs(this.x) < EPSILON &&
      Math.abs(this.y) < EPSILON &&
      Math.abs(this.z) < EPSILON
    )
  }

  public equals(v: Vector3): boolean {
    return this.x === v.x && this.y === v.y && this.z === v.z
  }

  public add(v: Vector3): Vector3 {
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z)
  }

  public sub(v: Vector3): Vector3 {
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z)
  }

  public mul(s: number): Vector3 {
    return new Vector3(this.x * s, this.y * s, this.z * s)
  }

  public mulVector(v: Vector3): Vector3 {
    return new Vector3(this.x * v.x, this.y * v.y, this.z * v.z)
  }

  public div(s: number): Vector3 {
    if (s === 0) throw Error('[Vector3.div]: cannot divide 0')
    return new Vector3(this.x / s, this.y / s, this.z / s)
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

    return new Vector3(this.x / len, this.y / len, this.z / len)
  }

  public strictLessThan(v: Vector3): boolean {
    return this.x < v.x && this.y < v.y && this.z < v.z
  }

  public strictGreaterThan(v: Vector3): boolean {
    return this.x > v.x && this.y > v.y && this.z > v.z
  }

  public equalTo(v: Vector3): boolean {
    return this.x === v.x && this.y === v.y && this.z === v.z
  }

  public applyMatrix4(m4: Matrix4): Vector3 {
    return new Vector3(
      m4.e[0] * this.x + m4.e[1] * this.y + m4.e[2] * this.z + m4.e[3],
      m4.e[4] * this.x + m4.e[5] * this.y + m4.e[6] * this.z + m4.e[7],
      m4.e[8] * this.x + m4.e[9] * this.y + m4.e[10] * this.z + m4.e[11]
    )
  }

  public static dotProduct(v1: Vector3, v2: Vector3): number {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z
  }

  public static crossProduct(v1: Vector3, v2: Vector3): Vector3 {
    const cp = new Vector3(
      v1.y * v2.z - v1.z * v2.y,
      v1.z * v2.x - v1.x * v2.z,
      v1.x * v2.y - v1.y * v2.x
    )

    if (cp.isZero()) return Y_AXIS
    return cp
  }

  public static tripleScalarProduct(
    v1: Vector3,
    v2: Vector3,
    v3: Vector3
  ): number {
    return Vector3.dotProduct(v1, Vector3.crossProduct(v2, v3))
  }

  // return the angle between two given vectors by radians.
  public static angleBetween(v1: Vector3, v2: Vector3): number {
    return Math.acos(Vector3.dotProduct(v1, v2) / (v1.len() * v2.len()))
  }

  public static isSameDirection(v1: Vector3, v2: Vector3): boolean {
    return Vector3.dotProduct(v1, v2) > 0
  }

  public static randomInUnitSphere(): Vector3 {
    while (true) {
      const randomUnitVector = new Vector3(
        -1 + Math.random() * 2,
        -1 + Math.random() * 2,
        -1 + Math.random() * 2
      )
      if (randomUnitVector.len2() >= 1) continue
      return randomUnitVector
    }
  }

  public static randomUnitVector(): Vector3 {
    return Vector3.randomInUnitSphere().normalize()
  }

  public static randomInHemisphere(normal: Vector3): Vector3 {
    const inUnitSphere = Vector3.randomInUnitSphere()
    if (Vector3.dotProduct(inUnitSphere, normal) > 0) return inUnitSphere
    return inUnitSphere.negate()
  }

  public static randomInUnitDisk(): Vector3 {
    while (true) {
      const p = new Vector3(-1 + Math.random() * 2, -1 + Math.random() * 2, 0)
      if (p.len2() >= 1) continue
      return p
    }
  }

  public static randomCosineDirection(): Vector3 {
    const r1 = Math.random()
    const r2 = Math.random()
    const z = Math.sqrt(1 - r2)

    const phi = 2 * Math.PI * r1
    const x = Math.cos(phi) * Math.sqrt(r2)
    const y = Math.sin(phi) * Math.sqrt(r2)

    return new Vector3(x, y, z)
  }

  public static randomToSphere(
    radius: number,
    distanceSquared: number
  ): Vector3 {
    const r1 = Math.random()
    const r2 = Math.random()
    const z = 1 + r2 * (Math.sqrt(1 - (radius * radius) / distanceSquared) - 1)

    const phi = 2 * Math.PI * r1
    const x = Math.cos(phi) * Math.sqrt(1 - z * z)
    const y = Math.sin(phi) * Math.sqrt(1 - z * z)
    return new Vector3(x, y, z)
  }

  // n: normal vector
  // v: inflect vector
  // return: reflect vector by n
  public static reflect(v: Vector3, n: Vector3): Vector3 {
    return v.sub(n.mul(Vector3.dotProduct(v, n) * 2))
  }

  public static refract(
    uv: Vector3,
    n: Vector3,
    refractiveIndex: number
  ): Vector3 {
    const cosTheta = Math.min(Vector3.dotProduct(uv.negate(), n), 1)
    const outPerpendicular = uv.add(n.mul(cosTheta)).mul(refractiveIndex)
    const outParallel = n.mul(-Math.sqrt(Math.abs(1 - outPerpendicular.len2())))
    return outPerpendicular.add(outParallel)
  }
}

export const ORIGIN = new Vector3(0, 0, 0)
export const EPSILON = 0.000001

export const X_AXIS_UNIT = new Vector3(1, 0, 0)
export const Y_AXIS_UNIT = new Vector3(0, 1, 0)
export const Z_AXIS_UNIT = new Vector3(0, 0, 1)
export const X_AXIS = X_AXIS_UNIT
export const Y_AXIS = Y_AXIS_UNIT
export const Z_AXIS = Z_AXIS_UNIT
