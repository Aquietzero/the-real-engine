import { Vector3 } from '@TRE/math'
import { Point } from './point'

// A segment in 3d space.
export class Segment {
  public a: Point = new Point()
  public b: Point = new Point()
  public dir: Vector3 = new Vector3()

  constructor(a: Point = new Point(), b: Point = new Point()) {
    this.a = a
    this.b = b
    this.dir = this.b.sub(this.a)
  }

  public clone(): Segment {
    return new Segment(this.a, this.b)
  }

  public parametric(t: number): Point {
    return this.a.add(this.dir.mul(t))
  }
}
