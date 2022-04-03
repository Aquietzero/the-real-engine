import * as _ from 'lodash'
import { Vector3 } from '@TRE/math'
import { AABB } from '@TRE/bounding-volumes'
import { Plane, Segment, Point } from '@TRE/primitive'

export class ClosestPoint {
  // Calculates a point on plane closest to the given point.
  public static onPlaneToPoint(p: Plane, v: Point): Point {
    const t: number = (Point.dotProduct(p.n, v) - p.d) / p.n.len2()
    return v.sub(p.n.mul(t))
  }

  public static onSegmentToPoint(s: Segment, p: Point): Point {
    const { a, b } = s
    const ab = b.sub(a)
    const t = Vector3.dotProduct(p.sub(a), ab) / Vector3.dotProduct(ab, ab)
    if (t < 0) return a.clone()
    if (t > 1) return b.clone()

    return a.clone().add(ab.mul(t))
  }

  public static onAABBToPoint(aabb: AABB, p: Point): Point {
    let cp = new Point()
    _.each(['x', 'y', 'z'], (d: 'x' | 'y' | 'z') => {
      const min = aabb.center[d] - aabb.radius[d]
      const max = aabb.center[d] + aabb.radius[d]

      cp[d] = p[d]
      if (cp[d] < min) cp[d] = min
      if (cp[d] > max) cp[d] = max
    })
    return cp
  }
}

export class Distance {
  public static ofPointToPlane(p: Plane, v: Point): number {
    return (Point.dotProduct(p.n, v) - p.d) / p.n.len2()
  }

  public static ofPointToSegment(s: Segment, p: Point): number {
    const { a, b } = s
    const ab = b.sub(a)
    const ap = p.sub(a)
    const bp = p.sub(b)

    const t1 = Vector3.dotProduct(ap, ab)
    if (t1 < 0) return ap.len()
    const t2 = Vector3.dotProduct(ab, ab)
    if (t1 >= t2) return bp.len()
    return Math.sqrt(ap.len2() - t1*t1 / t2)
  }

  public static ofPointToAABB(aabb: AABB, p: Point): number {
    let dist2 = 0
    let cp = new Point()

    _.each(['x', 'y', 'z'], (d: 'x' | 'y' | 'z') => {
      const min = aabb.center[d] - aabb.radius[d]
      const max = aabb.center[d] + aabb.radius[d]

      cp[d] = p[d]
      if (cp[d] < min) dist2 += (min - cp[d]) * (min - cp[d])
      if (cp[d] > max) dist2 += (cp[d] - max) * (cp[d] - max)
    })

    return Math.sqrt(dist2)
  }
}
