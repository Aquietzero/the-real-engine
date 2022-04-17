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

    let counter = 0
    while (counter < 100) {
      counter++

      let b = GJK.support(p1, p2, dir)

      if (dot(b, dir) <= 0) return false
      const next = GJK.nextSimplex(simplex, b, dir)
      if (next.passOrigin) return true
      console.log('mext', dir, next.dir)
      simplex = next.s
      dir = next.dir
    }
  }

  public static support(p1: Polyhedron, p2: Polyhedron, dir: Vector3): Vector3 {
    return p1.supportPoint(dir).sub(p2.supportPoint(dir.negate()))
  }

  public static nextSimplex(s: any, p: Point, dir: Vector3) {
    console.log(s, '---')
    // s is point
    if (_.isUndefined(s.b)) {
      return GJK.nextSimplexFromLine(new Segment(s, p), dir)
    }
    // s is segment
    if (_.isUndefined(s.c)) {
      return GJK.nextSimplexFromTriangle(
        new Triangle(s.a, s.b, p), dir
      )
    }
    // s is triangle
    return GJK.nextSimplexFromTetrahedron(
      new Tetrahedron(s.a, s.b, s.c, p), dir
    )
  }

  public static nextSimplexFromLine(s: Segment, dir: Vector3): {
    s?: Simplex,
    dir: Vector3,
    passOrigin: boolean,
  } {
    console.log(s, s.a, 'line ===')
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
    console.log(isSameDirection(ab, ao), newDir, dir, 'ssssss')
    return { s: simplex, dir: newDir, passOrigin: false }
  }

  public static nextSimplexFromTriangle(t: Triangle, dir: Vector3): {
    s?: Simplex,
    dir: Vector3,
    passOrigin: boolean,
  } {
    console.log(t, t.a, 'triangle ===')
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
    console.log(t, t.a, 'tetrahedron ===')
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
