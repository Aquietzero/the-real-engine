import { Vector3 } from './vector3'

export class Face3 {
  public a: Vector3 = new Vector3()
  public b: Vector3 = new Vector3()
  public c: Vector3 = new Vector3()

  constructor(
    a: Vector3 = new Vector3(),
    b: Vector3 = new Vector3(),
    c: Vector3 = new Vector3(),
  ) {
    this.a = a
    this.b = b
    this.c = c
  }

  public clone(): Face3 {
    return new Face3(this.a, this.b, this.c)
  }
}
