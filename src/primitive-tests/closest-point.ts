import { Plane, Point } from '@TRE/primitive'

export class ClosestPoint {
  // Calculates a point on plane closest to the given point.
  public static onPlaneToPoint(p: Plane, v: Point): Point {
    const t = (Point.dotProduct(p.n, v) - p.d) / p.n.len2()
    return v.sub(p.n.mul(t))
  }
}
