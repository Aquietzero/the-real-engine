import { Vector3 } from '@TRE/math'

export class Tetrahedron {
  a: Vector3 = new Vector3()
  b: Vector3 = new Vector3()
  c: Vector3 = new Vector3()
  d: Vector3 = new Vector3()

  constructor(
    a: Vector3 = new Vector3(),
    b: Vector3 = new Vector3(),
    c: Vector3 = new Vector3(),
    d: Vector3 = new Vector3()
  ) {
    this.a = a
    this.b = b
    this.c = c
    this.d = d
  }
}
