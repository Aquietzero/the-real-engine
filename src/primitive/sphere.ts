import { Point } from './point'

export class Sphere {
  public center: Point = new Point()
  public radius: number = 0

  constructor(center: Point = new Point(), radius: number = 0) {
    this.center = center
    this.radius = radius
  }

  public set(center: Point, radius: number) {
    this.center = center
    this.radius = radius
  }

  public clone(): Sphere {
    return new Sphere(this.center, this.radius)
  }
}
