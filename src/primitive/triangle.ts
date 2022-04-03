import { Point } from './point'

export class Triangle {
  public a: Point = new Point()
  public b: Point = new Point()
  public c: Point = new Point()

  constructor(
    a: Point = new Point(),
    b: Point = new Point(),
    c: Point = new Point(),
  ) {
    this.a = a
    this.b = b
    this.c = c
  }

  public clone(): Triangle {
    return new Triangle(this.a, this.b, this.c)
  }
}
