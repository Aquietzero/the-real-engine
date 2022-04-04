import { Vector3 } from '@TRE/math'
import { Point, Segment, Plane, Ray, Sphere, } from '@TRE/primitive'

export class Intersection {
  public static ofSegmentAndPlane(s: Segment, p: Plane): Point | null {
    const { dotProduct: dot } = Vector3
    const ab = s.b.sub(s.a)
    const t = (p.d - dot(p.n, s.a)) / dot(p.n, ab)
    if (t < 0 || t > 1) return
    return s.parametric(t)
  }

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
}
