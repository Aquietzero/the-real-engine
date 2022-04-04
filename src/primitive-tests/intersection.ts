import { Vector3 } from '@TRE/math'
import { Point, Segment, Plane } from '@TRE/primitive'

export class Intersection {
  public static ofSegmentAndPlane(s: Segment, p: Plane): Point | null {
    const { dotProduct: dot } = Vector3
    const ab = s.b.sub(s.a)
    const t = (p.d - dot(p.n, s.a)) / dot(p.n, ab)
    if (t < 0 || t > 1) return
    return s.parametric(t)
  }
}
