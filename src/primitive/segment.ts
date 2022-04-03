import { Point } from './point'

// A segment in 3d space.
export class Segment {
  public a: Point = new Point()
  public b: Point = new Point()

  constructor(a: Point = new Point(), b: Point = new Point()) {
    this.a = a
    this.b = b
  }

  public clone(): Segment {
    return new Segment(this.a, this.b)
  }
}
