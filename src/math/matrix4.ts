import { Vector3, EPSILON } from './vector3'

export type Matrix4Elements = [
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
]

// Matrix in 3d Euclidean space.
export class Matrix4 {
  public e: Matrix4Elements = [
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
  ]

  constructor(e?: Matrix4Elements) {
    if (e) {
      if (e.length !== 16)
        throw Error('[Matrix4.constructor]: 4x4 matrix accepts only 16 elements.')
      this.e = e
    }
  }

  public clone(): Matrix4 {
    return new Matrix4([...this.e])
  }

  public add(m: Matrix4): Matrix4 {
    return new Matrix4([
      this.e[0] + m.e[0], this.e[1] + m.e[1], this.e[2] + m.e[2], this.e[3] + m.e[3],
      this.e[4] + m.e[4], this.e[5] + m.e[5], this.e[6] + m.e[6], this.e[7] + m.e[7],
      this.e[8] + m.e[8], this.e[9] + m.e[9], this.e[10] + m.e[10], this.e[11] + m.e[11],
      this.e[12] + m.e[12], this.e[13] + m.e[13], this.e[14] + m.e[14], this.e[15] + m.e[15],
    ])
  }

  public sub(m: Matrix4): Matrix4 {
    return new Matrix4([
      this.e[0] - m.e[0], this.e[1] - m.e[1], this.e[2] - m.e[2], this.e[3] - m.e[3],
      this.e[4] - m.e[4], this.e[5] - m.e[5], this.e[6] - m.e[6], this.e[7] - m.e[7],
      this.e[8] - m.e[8], this.e[9] - m.e[9], this.e[10] - m.e[10], this.e[11] - m.e[11],
      this.e[12] - m.e[12], this.e[13] - m.e[13], this.e[14] - m.e[14], this.e[15] - m.e[15],
    ])
  }

  public mul(m: Matrix4): Matrix4 {
    const [
      a11, a12, a13, a14,
      a21, a22, a23, a24,
      a31, a32, a33, a34,
      a41, a42, a43, a44,
    ] = this.e
    const [
      b11, b12, b13, b14,
      b21, b22, b23, b24,
      b31, b32, b33, b34,
      b41, b42, b43, b44,
    ] = m.e

    return new Matrix4([
      a11*b11 + a12*b21 + a13*b31 + a14*b41,
      a11*b12 + a12*b22 + a13*b32 + a14*b42,
      a11*b13 + a12*b23 + a13*b33 + a14*b43,
      a11*b14 + a12*b24 + a13*b34 + a14*b44,

      a21*b11 + a22*b21 + a23*b31 + a24*b41,
      a21*b12 + a22*b22 + a23*b32 + a24*b42,
      a21*b13 + a22*b23 + a23*b33 + a24*b43,
      a21*b14 + a22*b24 + a23*b34 + a24*b44,

      a31*b11 + a32*b21 + a33*b31 + a34*b41,
      a31*b12 + a32*b22 + a33*b32 + a34*b42,
      a31*b13 + a32*b23 + a33*b33 + a34*b43,
      a31*b14 + a32*b24 + a33*b34 + a34*b44,

      a41*b11 + a42*b21 + a43*b31 + a44*b41,
      a41*b12 + a42*b22 + a43*b32 + a44*b42,
      a41*b13 + a42*b23 + a43*b33 + a44*b43,
      a41*b14 + a42*b24 + a43*b34 + a44*b44,
    ])
  }

  public equals(m: Matrix4): boolean {
    return this.e[0] === m.e[0] && this.e[1] === m.e[1] && this.e[2] === m.e[2]
      && this.e[3] === m.e[3] && this.e[4] === m.e[4] && this.e[5] === m.e[5]
      && this.e[6] === m.e[6] && this.e[7] === m.e[7] && this.e[8] === m.e[8]
      && this.e[9] === m.e[9] && this.e[10] === m.e[10] && this.e[11] === m.e[11]
      && this.e[12] === m.e[12] && this.e[13] === m.e[13] && this.e[14] === m.e[14]
      && this.e[15] === m.e[15]
  }

  public static fromScale(x: number, y: number, z: number): Matrix4 {
    return new Matrix4([
      x, 0, 0, 0,
      0, y, 0, 0,
      0, 0, z, 0,
      0, 0, 0, 1,
    ])
  }

  public static fromTranslate(x: number, y: number, z: number): Matrix4 {
    return new Matrix4([
      1, 0, 0, x,
      0, 1, 0, y,
      0, 0, 1, z,
      0, 0, 0, 1,
    ])
  }

  public static fromRotate(x: number, y: number, z: number): Matrix4 {
    return new Matrix4([
      Math.cos(y)*Math.cos(z), Math.sin(z), Math.sin(y), 0,
      -Math.sin(z), Math.cos(x)*Math.cos(z), Math.sin(x), 0,
      -Math.sin(y), -Math.sin(x), Math.cos(x)*Math.cos(y), 0,
      0, 0, 0, 1,
    ])
  }

  // rotation matrix from v1 to v2
  public static fromDirToDir(d1: Vector3, d2: Vector3): Matrix4 {
    const e1 = d1.normalize()
    const e2 = d2.normalize()
    const v = Vector3.crossProduct(e1, e2)
    const e = Vector3.dotProduct(e1, e2)
    const h = 1/(1 + e)
    return new Matrix4([
      e + h*v.x*v.x, h*v.x*v.y - v.z, h*v.x*v.z + v.y, 0,
      h*v.x*v.y + v.z, e + h*v.y*v.y, h*v.y*v.z - v.x, 0,
      h*v.x*v.z - v.y, h*v.y*v.z + v.x, e + h*v.z*v.z, 0,
      0, 0, 0, 1,
    ])
  }
}

export const ZERO_MATRIX = new Matrix4()
export const IDENTITY_MATRIX = new Matrix4([
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1,
])

