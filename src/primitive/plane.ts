import { Vector3 } from '@TRE/math'

// A 2d plane in 3d Euclidean space
export class Plane {
  public n: Vector3 = new Vector3()
  public d: number = 0

  constructor(n: Vector3 = new Vector3(), d: number = 0) {
    this.n = n
    this.d = d
  }

  public set(n: Vector3, d: number) {
    this.n = n
    this.d = d
  }

  public clone(): Plane {
    return new Plane(this.n, this.d)
  }

  public normalize() {
    this.n = this.n.normalize()
  }
}
