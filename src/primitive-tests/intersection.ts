import * as _ from 'lodash'
import { Vector3, EPSILON } from '@TRE/math'
import { AABB } from '@TRE/bounding-volumes'
import {
  Point, Segment, Plane, Ray, Sphere, Triangle, Line,
} from '@TRE/primitive'

export class Intersection {
  public static ofSegmentAndPlane(s: Segment, p: Plane): Point | null {
    const { dotProduct: dot } = Vector3
    const ab = s.b.sub(s.a)
    const t = (p.d - dot(p.n, s.a)) / dot(p.n, ab)
    if (t < 0 || t > 1) return
    return s.parametric(t)
  }

  // XXX Direction of ray should be normalized.
  public static ofRayAndSphere(r: Ray, s: Sphere): Point | null {
    const { dotProduct: dot } = Vector3
    const m = r.p.sub(s.center)
    const b = dot(m, r.dir)
    const c = dot(m, m) - s.radius * s.radius

    // Exit if ray's origin is outside s (c > 0) and
    // r is pointing away from s (b > 0)
    if (c > 0 && b > 0) return

    const discriminant = b*b - c
    if (discriminant < 0) return

    let t = -b - Math.sqrt(discriminant)
    // If t is negative, ray started inside sphere so clamp it to zero
    if (t < 0) t = 0
    return r.parametric(t)
  }

  public static ofRayAndAABB(r: Ray, aabb: AABB): {
    min?: Point
    max?: Point
  } {
    let tMin = 0
    let tMax = Infinity

    const min = aabb.center.sub(aabb.radius)
    const max = aabb.center.add(aabb.radius)

    const dimensions: Array<'x' | 'y' | 'z'> = ['x', 'y', 'z']
    for (let d of dimensions) {
      if (Math.abs(r.dir[d]) < EPSILON) {
        // Ray is parallel to slab. No hit if origin is not within slab
        if (r.p[d] < min[d] || r.p[d] > max[d]) return {}
      } else {
        // Compute intersection t value of ray with near and far plane of slab
        const ood = 1 / r.dir[d]
        let t1 = (min[d] - r.p[d]) * ood
        let t2 = (max[d] - r.p[d]) * ood

        if (t1 > t2) [t1, t2] = [t2, t1]
        if (t1 > tMin) tMin = t1
        if (t2 < tMax) tMax = t2

        if (tMin > tMax) return {}
      }
    }

    return {
      min: r.parametric(tMin),
      max: r.parametric(tMax),
    }
  }

  public static ofLineAndTriangle(l: Line, t: Triangle): Point | null {
    const p = l.p
    const q = l.p.add(l.dir)
    const { a, b, c } = t
    const { tripleScalarProduct: scalarProduct } = Vector3

    const pq = q.sub(p)
    const pa = a.sub(p)
    const pb = b.sub(p)
    const pc = c.sub(p)

    let u = scalarProduct(pq, pc, pb)
    if (u < 0) return
    let v = scalarProduct(pq, pa, pc)
    if (v < 0) return
    let w = scalarProduct(pq, pb, pa)
    if (w < 0) return

    const denom = 1 / (u + v + w)
    u *= denom
    v *= denom
    w *= denom
    return a.mul(u).add(b.mul(v)).add(c.mul(w))
  }

  public static ofSegmentAndTriangle(s: Segment, triangle: Triangle): Point | null {
    const { a, b, c } = triangle
    const { a: p, b: q } = s

    const ab = b.sub(a)
    const ac = c.sub(a)
    const qp = p.sub(q)

    const { dotProduct: dot, crossProduct: cross } = Vector3

    // Compute triangle normal. Can be precalculated or cached if
    // intersecting multiple segments against the same triangle
    const n = cross(ab, ac)

    // Compute denominator d. If d <= 0, segment is parallel to or
    // points away from triangle, so exit early
    const d = dot(qp, n)
    if (d <= 0) return

    // Compute intersection t value of pq with plane of triangle. A ray
    // intersects iff 0 <= t. Segment intersects iff 0 <= t <= 1. Delay
    // deviding by d until intersection has been found to pierce triangle
    const ap = p.sub(a)
    let t = dot(ap, n)
    if (t < 0) return
    if (t > d) return // for segment

    // Compute barycentric coordinate components and test if within bounds
    const e = cross(qp, ap)
    let v = dot(ac, e)
    if (v < 0 || v > d) return
    let w = -dot(ab, e)
    if (w < 0 || v + w > d) return

    t /= d
    v /= d
    w /= d
    const u = 1 - v - w
    return a.mul(u).add(b.mul(v)).add(c.mul(w))
  }

  public static ofPlaneAndPlane(p1: Plane, p2: Plane): Line | null {
    const d = Vector3.crossProduct(p1.n, p2.n)
    const denom = Vector3.dotProduct(d, d)
    if (denom < EPSILON) return

    const p = Vector3.crossProduct(p2.n.mul(p1.d).sub(p1.n.mul(p2.d)), d).div(denom)
    return new Line(p, d)
  }
}
