import * as _ from 'lodash'
import { Vector3, X_AXIS_UNIT } from '@TRE/math'
import { Point, Segment, Triangle, Tetrahedron, Polyhedron } from '@TRE/primitive'

type Simplex = Point | Segment | Triangle | Tetrahedron

const {
  dotProduct: dot,
  crossProduct: cross,
  isSameDirection,
} = Vector3

export class GJK {
  public static testCollision(p1: Polyhedron, p2: Polyhedron): boolean {
    let a = GJK.support(p1, p2, X_AXIS_UNIT)
    let dir = a.negate()
    let simplex: Simplex = a

    while (true) {
      let b = GJK.support(p1, p2, dir)

      if (dot(b, dir) <= 0) return false
      const next = GJK.nextSimplex(simplex, b, dir)
      if (next.passOrigin) return true
      simplex = next.s
      dir = next.dir
    }
  }

  public static support(p1: Polyhedron, p2: Polyhedron, dir: Vector3): Vector3 {
    return p1.supportPoint(dir).sub(p2.supportPoint(dir.negate()))
  }

  public static nextSimplex(s: any, p: Point, dir: Vector3) {
    // s is point
    if (_.isUndefined(s.b)) {
      return GJK.nextSimplexFromLine(new Segment(p, s), dir)
    }
    // s is segment
    if (_.isUndefined(s.c)) {
      return GJK.nextSimplexFromTriangle(
        new Triangle(p, s.a, s.b), dir
      )
    }
    // s is triangle
    return GJK.nextSimplexFromTetrahedron(
      new Tetrahedron(p, s.a, s.b, s.c), dir
    )
  }

  public static nextSimplexFromLine(s: Segment, dir: Vector3): {
    s?: Simplex,
    dir: Vector3,
    passOrigin: boolean,
  } {
    const ab = s.b.sub(s.a)
    const ao = s.a.negate()
    let newDir = dir
    let simplex: Simplex = s

    if (isSameDirection(ab, ao)) {
      newDir = cross(cross(ab, ao), ab)
    } else {
      newDir = ao
      simplex = s.a
    }
    return { s: simplex, dir: newDir, passOrigin: false }
  }

  public static nextSimplexFromTriangle(t: Triangle, dir: Vector3): {
    s?: Simplex,
    dir: Vector3,
    passOrigin: boolean,
  } {
    const { a, b, c } = t
    const ab = b.sub(a)
    const ac = c.sub(a)
    const ao = a.negate()
    const abc = cross(ab, ac)
    let newDir = dir
    let simplex: Simplex = t

    if (isSameDirection(cross(abc, ac), ao)) {
      if (isSameDirection(ac, ao)) {
        simplex = new Segment(a, c)
        newDir = cross(cross(ac, ao), ac)
      } else {
        return GJK.nextSimplexFromLine(new Segment(a, b), dir)
      }
    } else {
      if (isSameDirection(cross(ab, abc), ao)) {
        return GJK.nextSimplexFromLine(new Segment(a, b), dir)
      } else {
        if (isSameDirection(abc, ao)) {
          newDir = abc
        } else {
          simplex = new Triangle(a, c, b)
          newDir = abc.negate()
        }
      }
    }

    return { s: simplex, dir: newDir, passOrigin: false }
  }

  public static nextSimplexFromTetrahedron(t: Tetrahedron, dir: Vector3): {
    s?: Simplex,
    dir: Vector3,
    passOrigin: boolean,
  } {
    const { a, b, c, d } = t
    const ab = b.sub(a)
    const ac = c.sub(a)
    const ad = d.sub(a)
    const ao = a.negate()

    const abc = cross(ab, ac)
    const acd = cross(ac, ad)
    const adb = cross(ad, ab)

    let newDir = dir
    let simplex: Simplex = t

    if (isSameDirection(abc, ao)) {
      return GJK.nextSimplexFromTriangle(new Triangle(a, b, c), dir)
    }
    if (isSameDirection(acd, ao)) {
      return GJK.nextSimplexFromTriangle(new Triangle(a, c, d), dir)
    }
    if (isSameDirection(adb, ao)) {
      return GJK.nextSimplexFromTriangle(new Triangle(a, d, b), dir)
    }

    return { s: simplex, dir: newDir, passOrigin: true }
  }
}
