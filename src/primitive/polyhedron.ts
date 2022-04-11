import * as _ from 'lodash'
import { Vector3, Face3 } from '@TRE/math'
import { GeometricalTests, ORIENT } from '@TRE/primitive-tests'

export class Polyhedron {
  centroid: Vector3 = new Vector3()
  vertices: Vector3[] = []
  faces: Face3[] = []

  constructor(vertices: Vector3[] = [], faces: Face3[] = []) {
    this.vertices = vertices
    this.faces = faces
  }

  public static convexHull(vertices: Vector3[]): Polyhedron | null {
    if (vertices.length < 4) return
    // initialize H = p1, p2, p3, p4
    // for i = 5 to n do:
    //   for each face f of H do:
    //      compute volume of tetrahedron formed by (f,pi)
    //      if volume < 0: f is visible
    //   if no faces are visible
    //      discard pi (pi must be inside H)
    //   else
    //      find border edge of all visible faces
    //      for each border edge e construct a face (e,pi) and add to H
    //      for each visible face f: delete f from H
  }

  public static initConvexHull(vertices: Vector3[]): Polyhedron {
    const vs = _.shuffle(vertices)
    const [p1, p2, ...ps] = vs
    const { isCollinear, orient3d } = GeometricalTests

    let p3, p4, p3Index
    // search for the first point not collinear with p1 and p2
    for (let i = 0; i < ps.length; ++i) {
      if (!isCollinear(p1, p2, ps[i])) {
        p3 = ps[i]
        p3Index = i
        break
      }
    }

    if (!p3)
      throw new Error('[Polyhedron.initConvexHull]: All vertices are collinear.')

    // search for the first point not coplanar with p1, p2, p3
    for (let i = p3Index + 1; i < ps.length; ++i) {
      if (orient3d(p1, p2, p3, ps[i]) === ORIENT.COUNTERCLOCKWISE) {
        p4 = ps[i]
        break
      }
    }

    return new Polyhedron([p1, p2, p3, p4], [
      new Face3(p1, p2, p3),
      new Face3(p1, p2, p4),
      new Face3(p2, p3, p4),
      new Face3(p3, p1, p4),
    ])
  }
}
