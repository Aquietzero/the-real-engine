import * as _ from 'lodash'
import { Vector3 } from '@TRE/math'
import { AABB } from '@TRE/bounding-volumes'
import { Plane, Segment, Point, Triangle } from '@TRE/primitive'

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
    const { dotProduct: dot, crossProduct: cross, tripleScalarProduct } = Vector3
    const { a, b, c } = triangle
    const ab = b.sub(a)
    const ac = c.sub(a)
    const bc = c.sub(b)

    // Compute parametric position s for projection P' of P on AB.
    // P' = A + s x AB, s = snom / (snom + sdenom)
    const snom = dot(p.sub(a), ab)
    const sdenom = dot(p.sub(b), a.sub(b))

    // Compute parametric position t for projection P' of P on AC.
    // P' = A + t x AB, t = tnom / (tnom + tdenom)
    const tnom = dot(p.sub(a), ac)
    const tdenom = dot(p.sub(c), a.sub(c))

    if (snom <= 0 && tnom <= 0) return a.clone()

    // Compute parametric position u for projection P' of P on BC.
    // P' = B + u x BC, u = unom / (unom + udenom)
    const unom = dot(p.sub(b), bc)
    const udenom = dot(p.sub(c), b.sub(c))

    if (sdenom <= 0 && unom <= 0) return b.clone()
    if (tdenom <= 0 && udenom <= 0) return c.clone()

    // P is outside (or on) AB if the triple scalar product [N PA PB] <= 0
    const n = cross(b.sub(a), c.sub(a))
    const vc = tripleScalarProduct(n, a.sub(p), b.sub(p))

    // If P outside AB and within feature region of AB,
    // return projection of P onto AB
    if (vc <= 0 && snom >= 0 && sdenom >= 0)
      return a.add(ab.mul(snom / (snom + sdenom)))

    // P is outside (or on) BC if the triple scalar product [N PB PC] <= 0
    const va = tripleScalarProduct(n, b.sub(p), c.sub(p))
    // If P outside BC and within feature region of BC,
    // return projection of P onto BC
    if (va <= 0 && unom >= 0 && udenom >= 0)
      return b.add(bc.mul(unom / (unom + udenom)))

    // P is outside (or on) CA if the triple scalar product [N PC PA] <= 0
    const vb = tripleScalarProduct(n, c.sub(p), a.sub(p))
    // If P outside BC and within feature region of BC,
    // return projection of P onto BC
    if (vb <= 0 && tnom >= 0 && tdenom >= 0)
      return a.add(ac.mul(tnom / (tnom + tdenom)))

    // P must project inside face region. Compute Q using barycentric coordinates
    const u = va / (va + vb + vc)
    const v = vb / (va + vb + vc)
    const w = 1 - u - v
    return a.mul(u).add(b.mul(v)).add(c.mul(w))
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
