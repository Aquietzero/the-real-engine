import * as _ from 'lodash'
import { Vector3, EPSILON } from '@TRE/math'
import { AABB } from '@TRE/bounding-volumes'
import { Point, Segment, Plane, Ray, Sphere, } from '@TRE/primitive'

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
}
