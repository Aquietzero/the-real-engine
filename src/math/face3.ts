import { Vector3 } from './vector3'

export class Face3 {
  public a: Vector3 = new Vector3()
  public b: Vector3 = new Vector3()
  public c: Vector3 = new Vector3()

  public get normal(): Vector3 {
    const ab = this.b.sub(this.a)
    const bc = this.c.sub(this.b)
    return Vector3.crossProduct(ab, bc).normalize()
  }

  public get centroid(): Vector3 {
    return this.a.add(this.b).add(this.c).div(3)
  }

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

  public equalTo(f: Face3): boolean {
    return this.a.equalTo(f.a) && this.b.equalTo(f.b) && this.c.equalTo(f.c)
  }
}
