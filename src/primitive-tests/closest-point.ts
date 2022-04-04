import * as _ from 'lodash'
import { Vector3 } from '@TRE/math'
import { AABB } from '@TRE/bounding-volumes'
import { Plane, Segment, Point, Triangle, Line } from '@TRE/primitive'

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

  public static onTriangleToPoint(triangle: Triangle, p: Point): Point {
    const { dotProduct: dot } = Vector3
    const { a, b, c } = triangle

    const ab = b.sub(a)
    const ac = c.sub(a)
    const ap = p.sub(a)

    // Check if P in vertex region outside A
    const d1 = dot(ab, ap)
    const d2 = dot(ac, ap)
    // barycentric coordinate (1, 0, 0)
    if (d1 <= 0 && d2 <= 0) return a.clone()

    // Check if P in vertex region outside B
    const bp = p.sub(b)
    const d3 = dot(ab, bp)
    const d4 = dot(ac, bp)
    // barycentric coordinate (0, 1, 0)
    if (d3 >= 0 && d4 <= d3) return b.clone()

    // Check if P in edge region of AB, if so return projection of P onto AB
    const vc = d1*d4 - d3*d2
    if (vc <= 0 && d1 >= 0 && d3 <= 0) {
      const v = d1/(d1 - d3)
      // barycentric coordinate (1-v, v, 0)
      return a.add(ab.mul(v))
    }

    // Check if P in vertex region outside C
    const cp = p.sub(c)
    const d5 = dot(ab, cp)
    const d6 = dot(ac, cp)
    // barycentric coordinate (0, 0, 1)
    if (d6 >= 0 && d5 <= d6) return c.clone()

    // Check if P in edge region of AC, if so return projection of P onto AC
    const vb = d5*d2 - d1*d6
    if (vb <= 0 && d2 >= 0 && d6 <= 0) {
      const w = d2 / (d2 - d6)
      // barycentric coordinate (1-w, 0, w)
      return a.add(ac.mul(w))
    }

    // Check if P in edge region of BC, if so return projection of P onto BC
    const va = d3*d6 - d5*d4
    if (va <= 0 && (d4 - d3) >= 0 && (d5 - d6) >= 0) {
      const w = (d4 - d3) / ((d4 - d3) + (d5 - d6))
      // barycentric coordinate (0, 1-w, w)
      return b.add(c.sub(b).mul(w))
    }

    // P inside face region. Compute Q through its barycentric coordinates (u, v, w)
    const denom = 1 / (va + vb + vc)
    const v = vb * denom
    const w = vc * denom
    return a.add(ab.mul(v)).add(ac.mul(w))
  }

  public static betweenLines(l1: Line, l2: Line): { p1: Point, p2: Point } {
    const { dotProduct: dot } = Vector3
    const r = l1.p.sub(l2.p)
    const a = dot(l1.dir, l1.dir)
    const b = dot(l1.dir, l2.dir)
    const c = dot(l1.dir, r)
    const e = dot(l2.dir, l2.dir)
    const f = dot(l2.dir, r)
    const d = a*e - b*b

    const s = (b*f - c*e)/d
    const t = (a*f - b*c)/d
    return {
      p1: l1.parametric(s),
      p2: l2.parametric(t),
    }
  }
}
