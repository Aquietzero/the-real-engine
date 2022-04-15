import * as _ from 'lodash'
import {
  Vector2, Vector3, Determinant,
  EPSILON, PLANE_THICKNESS_EPSILON,
} from '@TRE/math'
import { Point, Plane, Polygon } from '@TRE/primitive'

export enum ORIENT {
  CLOCKWISE,
  COUNTERCLOCKWISE,
  COLLINEAR,
  COPLANAR,
}

export enum POSITION {
  FRONT,
  BEHIND,
  INSIDE,
  STRADDLING,
  COPLANAR,
}

export class GeometricalTests {
  // if orient < 0
  //    `abc` is in a clockwise order
  public static orient2d(a: Vector2, b: Vector2, c: Vector2): ORIENT {
    const orient = Determinant.ofMatrix3x3([
      a.x, a.y, 1,
      b.x, b.y, 1,
      c.x, c.y, 1,
    ])

    if (orient === 0) return ORIENT.COLLINEAR
    if (orient < 0) return ORIENT.CLOCKWISE
    return ORIENT.COUNTERCLOCKWISE
  }

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

  public static classifyPointToPlane(point: Point, plane: Plane): POSITION {
    const dist = Vector3.dotProduct(plane.n, point) - plane.d
    if (dist > PLANE_THICKNESS_EPSILON) {
      return POSITION.FRONT
    }
    if (dist < -PLANE_THICKNESS_EPSILON) {
      return POSITION.BEHIND
    }
    return POSITION.INSIDE
  }

  public static classifyPolygonToPlane(polygon: Polygon, plane: Plane): POSITION {
    let numOfVerticesFront = 0
    let numOfVerticesBehind = 0
    _.each(polygon.vertices, v => {
      switch (GeometricalTests.classifyPointToPlane(v, plane)) {
        case POSITION.FRONT:
          numOfVerticesFront++
          break
        case POSITION.BEHIND:
          numOfVerticesBehind++
          break
      }
    })

    if (numOfVerticesBehind != 0 && numOfVerticesFront != 0)
      return POSITION.STRADDLING

    if (numOfVerticesBehind != 0)
      return POSITION.BEHIND
    if (numOfVerticesFront != 0)
      return POSITION.FRONT

    return POSITION.COPLANAR
  }
}
