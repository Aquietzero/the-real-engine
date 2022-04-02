import * as _ from 'lodash'
import { Vector3 } from '@TRE/math'
import { Sphere as BasicSphere } from '@TRE/primitive'
import { AABB } from '@TRE/bounding-volumes'

export class Sphere extends BasicSphere {
  public static fromDistantPoints(vs: Vector3[]): Sphere {
    const { min, max } = AABB.mostSeparatedPoints(vs)
    const center = min.add(max).mul(0.5)
    const radius = max.sub(center).len()
    return new Sphere(center, radius)
  }

  public static fromSphereAndPoint(s: Sphere, v: Vector3): Sphere {
    const d = v.sub(s.center)
    const dist2 = d.len2()
    if (dist2 <= s.radius * s.radius) return s

    const dist = Math.sqrt(dist2)
    const newRadius = (s.radius + dist) * 0.5
    const k = (newRadius - s.radius) / dist
    return new Sphere(s.center.add(d.mul(k)), newRadius)
  }

  public static calculateSphere(vs: Vector3[]): Sphere {
    let s = Sphere.fromDistantPoints(vs)
    _.each(vs, v => {
      s = Sphere.fromSphereAndPoint(s, v)
    })
    return s
  }
}
