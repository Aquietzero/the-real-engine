import * as _ from 'lodash'
import { Vector3 } from '@TRE/math'
import { AABB } from '@TRE/bounding-volumes'
import {
  Sphere, Plane, Triangle,
} from '@TRE/primitive'
import { Distance } from './distance'
import { ClosestPoint } from './closest-point'

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

  // Test if AABB aabb intersects plane p
  public static testAABBPlane(aabb: AABB, p: Plane): boolean {
    // Compute the projection interval radius of aabb onto
    // L(t) = aabb.center + t x p.n
    const r = aabb.radius.x * Math.abs(p.n.x)
      + aabb.radius.y * Math.abs(p.n.y)
      + aabb.radius.z * Math.abs(p.n.z)
    // Compute distance of box cetner from plane
    const s = Vector3.dotProduct(p.n, aabb.center) - p.d
    return Math.abs(s) <= r
  }

  // Test if a sphere intersects an AABB.
  public static testSphereAABB(s: Sphere, aabb: AABB): boolean {
    const dist = Distance.ofPointToAABB(aabb, s.center)
    return dist <= s.radius
  }

  // Test if a sphere intersects a Triangle.
  public static testSphereTriangle(s: Sphere, t: Triangle): boolean {
    const p = ClosestPoint.onTriangleToPoint(t, s.center)
    return p.sub(s.center).len2() <= s.radius * s.radius
  }
}
