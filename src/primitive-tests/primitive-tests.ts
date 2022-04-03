import * as _ from 'lodash'
import { Vector3 } from '@TRE/math'
import { AABB } from '@TRE/bounding-volumes'
import {
  Sphere, Plane, Segment, Point, Triangle, Line,
} from '@TRE/primitive'

export class PrimitiveTests {
  // Determine whether plane p intersects sphere s
  public static testSpherePlane(s: Sphere, p: Plane): boolean {
    const dist = Vector3.dotProduct(s.center, p.n) - p.d
    return Math.abs(dist) <= s.radius
  }

  // Determine whether sphere s is fully behind (inside negative halfspace
  // of) plane p
  public static isSphereInsidePlane(s: Sphere, p: Plane): boolean {
    const dist = Vector3.dotProduct(s.center, p.n) - p.d
    return dist < -s.radius
  }

  // Determine whether sphere s intersects negative halfspace of plane p
  public static testSphereHalfspace(s: Sphere, p: Plane): boolean {
    const dist = Vector3.dotProduct(s.center, p.n) - p.d
    return dist <= s.radius
  }
}
