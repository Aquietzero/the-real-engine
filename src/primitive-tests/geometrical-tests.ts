import { Vector3, Determinant, EPSILON } from '@TRE/math'
import { Point } from '@TRE/primitive'

export enum ORIENT {
  CLOCKWISE,
  COUNTERCLOCKWISE,
  COPLANAR,
}

export class GeometricalTests {
  // if orient < 0
  //   `d` lies above the supporting plane of triangle `abc`, in the sense
  //   that `abc` appears in counterclockwise order when viewed from `d`.
  public static orient3d(a: Point, b: Point, c: Point, d: Point): ORIENT {
    const orient = Determinant.ofMatrix4x4([
      a.x, a.y, a.z, 1,
      b.x, b.y, b.z, 1,
      c.x, c.y, c.z, 1,
      d.x, d.y, d.z, 1,
    ])

    if (orient === 0) return ORIENT.COPLANAR
    if (orient < 0) return ORIENT.COUNTERCLOCKWISE
    return ORIENT.CLOCKWISE
  }

  public static isCollinear(a: Point, b: Point, c: Point): boolean {
    const ab = b.sub(a)
    const ac = c.sub(a)
    const cos = Vector3.dotProduct(ab, ac) / (ab.len()*ac.len())
    return 1 - Math.abs(cos) < EPSILON
  }
}
