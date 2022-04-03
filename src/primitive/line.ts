import { Point } from './point'
import { Vector3 } from '@TRE/math'

// A line in 3d space.
export class Line {
  public p: Point = new Point()
  public dir: Vector3 = new Vector3()

  constructor(p: Point = new Point(), dir: Vector3 = new Vector3()) {
    this.p = p
    this.dir = dir
  }

  public clone(): Line {
    return new Line(this.p, this.dir)
  }

  public parametric(t: number): Point {
    return this.p.add(this.dir.mul(t))
  }

  public normalize() {
    this.dir.normalize()
  }
}
