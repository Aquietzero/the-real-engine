import * as _ from 'lodash'
import { Vector3, ORIGIN, EPSILON } from '@TRE/math'
import { AABB } from '@TRE/bounding-volumes'
import {
  Sphere, Plane, Triangle, Segment, Ray,
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

  // Test if a sphere intersects a triangle.
  public static testSphereTriangle(s: Sphere, t: Triangle): boolean {
    const p = ClosestPoint.onTriangleToPoint(t, s.center)
    return p.sub(s.center).len2() <= s.radius * s.radius
  }

  // Test if an aabb intersects a triangle.
  public static testAABBTriangle(aabb: AABB, t: Triangle): boolean {
    let p0, p1, p2, r

    const { x: e0, y: e1, z: e2 } = aabb.radius

    // Translate the triangle as conceptually moving AABB to origin
    const v0 = t.a.sub(aabb.center)
    const v1 = t.b.sub(aabb.center)
    const v2 = t.c.sub(aabb.center)

    const f0 = v1.sub(v0)
    const f1 = v2.sub(v1)
    const f2 = v0.sub(v2)

    // Test axis a00 = (0, -f0.z, f0.y)
    p0 = v0.z*f0.y - v0.y*f0.z
    p2 = v2.z*f0.y - v2.y*f0.z
    r = e1 * Math.abs(f0.z) + e2 * Math.abs(f0.y)
    if (Math.max(-Math.max(p0, p2), Math.min(p0, p2)) > r) return false

    // Test axis a01 = (0, -f1.z, f1.y)
    p0 = v0.z*f1.y - v0.y*f1.z
    p1 = v1.z*f1.y - v1.y*f1.z
    r = e1 * Math.abs(f1.z) + e2 * Math.abs(f1.y)
    if (Math.max(-Math.max(p0, p1), Math.min(p0, p1)) > r) return false

    // Test axis a02 = (0, -f2.z, f2.y)
    p1 = v1.z*f2.y - v1.y*f2.z
    p2 = v2.z*f2.y - v2.y*f2.z
    r = e1 * Math.abs(f2.z) + e2 * Math.abs(f2.y)
    if (Math.max(-Math.max(p1, p2), Math.min(p1, p2)) > r) return false

    // Test axis a10 = (f0.z, 0, -f0.x)
    p0 = v0.x*f0.z - v0.z*f0.x
    p2 = v2.x*f0.z - v2.z*f0.x
    r = e0 * Math.abs(f0.z) + e2 * Math.abs(f0.x)
    if (Math.max(-Math.max(p0, p2), Math.min(p0, p2)) > r) return false

    // Test axis a11 = (f1.z, 0, -f1.x)
    p0 = v0.x*f1.z - v0.z*f1.x
    p1 = v1.x*f1.z - v1.z*f1.x
    r = e0 * Math.abs(f1.z) + e2 * Math.abs(f1.x)
    if (Math.max(-Math.max(p0, p1), Math.min(p0, p1)) > r) return false

    // Test axis a12 = (f2.z, 0, -f2.x)
    p1 = v1.x*f2.z - v1.z*f2.x
    p2 = v2.x*f2.z - v2.z*f2.x
    r = e0 * Math.abs(f2.z) + e2 * Math.abs(f2.x)
    if (Math.max(-Math.max(p1, p2), Math.min(p1, p2)) > r) return false

    // Test axis a20 = (-f0.y, f0.x, 0)
    p0 = v0.y*f0.x - v0.x*f0.y
    p2 = v2.y*f0.z - v2.x*f0.y
    r = e0 * Math.abs(f0.y) + e1 * Math.abs(f0.x)
    if (Math.max(-Math.max(p0, p2), Math.min(p0, p2)) > r) return false

    // Test axis a21 = (-f1.y, f1.x, 0)
    p0 = v0.y*f1.x - v0.x*f1.y
    p1 = v1.y*f1.x - v1.x*f1.y
    r = e0 * Math.abs(f1.y) + e1 * Math.abs(f1.x)
    if (Math.max(-Math.max(p0, p1), Math.min(p0, p1)) > r) return false

    // Test axis a22 = (-f2.y, f2.x, 0)
    p1 = v1.y*f2.x - v1.x*f2.y
    p2 = v2.y*f2.x - v2.x*f2.y
    r = e0 * Math.abs(f2.y) + e1 * Math.abs(f2.x)
    if (Math.max(-Math.max(p1, p2), Math.min(p1, p2)) > r) return false

    // Test the three axes corresponding to the face normals of AABB
    if (Math.max(v0.x, v1.x, v2.x) < -e0 || Math.min(v0.x, v1.x, v2.x) > e0) return false;
    if (Math.max(v0.y, v1.y, v2.y) < -e1 || Math.min(v0.y, v1.y, v2.y) > e1) return false;
    if (Math.max(v0.z, v1.z, v2.z) < -e2 || Math.min(v0.z, v1.z, v2.z) > e2) return false;

    // Test separating axis correspinding to triangle face nomral
    const pn = Vector3.crossProduct(f0, f1)
    const p = new Plane(pn, Vector3.dotProduct(pn, v0))
    const aabbOrigin = new AABB(ORIGIN, aabb.radius.clone())
    return PrimitiveTests.testAABBPlane(aabbOrigin, p)
  }

  // Test whether a segment intersects with a plane
  public static testSegmentPlane(s: Segment, p: Plane): boolean {
    const { dotProduct: dot } = Vector3
    const ab = s.b.sub(s.a)
    const t = (p.d - dot(p.n, s.a)) / dot(p.n, ab)
    return 0 <= t && t <= 1
  }

  // Test whether a ray intersects with a sphere
  public static testRaySphere(r: Ray, s: Sphere): boolean {
    const { dotProduct: dot } = Vector3
    const m = r.p.sub(s.center)
    const c = dot(m, m) - s.radius * s.radius

    if (c <= 0) return true

    const b = dot(m, r.dir)
    if (b > 0) return false
    const discriminant = b*b - c
    if (discriminant < 0) return false

    return true
  }

  // Test whether a segment intersects with an aabb
  public static testSegmentAABB(s: Segment, aabb: AABB): boolean {
    const { x: ex, y: ey, z: ez } = aabb.radius
    // segment midpoint
    let m = s.a.add(s.b).mul(0.5)
    // segment halflength vector
    const d = m.sub(s.a)
    m = m.sub(aabb.center)

    // Try world coordinate axes as separating axes
    let adx = Math.abs(d.x)
    if (Math.abs(m.x) > ex + adx) return false
    let ady = Math.abs(d.y)
    if (Math.abs(m.y) > ey + ady) return false
    let adz = Math.abs(d.z)
    if (Math.abs(m.z) > ez + adz) return false

    // Add in an epsilon term to counteract arithmetic errors when segment is
    // (near) parallel to a coordinate axis (see text for detail)
    adx += EPSILON
    ady += EPSILON
    adz += EPSILON

    if (Math.abs(m.y*d.z - m.z*d.y) > ey*adz + ez*ady) return false
    if (Math.abs(m.y*d.x - m.x*d.z) > ex*adz + ez*adx) return false
    if (Math.abs(m.x*d.y - m.y*d.x) > ex*ady + ey*adx) return false

    return true
  }
}
