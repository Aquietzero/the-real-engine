import { Vector3 } from '@TRE/math'

export class Sphere {
  public center: Vector3 = new Vector3()
  public radius: number = 0

  constructor(center: Vector3 = new Vector3(), radius: number = 0) {
    this.center = center
    this.radius = radius
  }

  public set(center: Vector3, radius: number) {
    this.center = center
    this.radius = radius
  }

  public clone(): Sphere {
    return new Sphere(this.center, this.radius)
  }
}
