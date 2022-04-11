import * as _ from 'lodash'
import { Vector3, Face3 } from '@TRE/math'
import { Point } from '@TRE/primitive'
import { GeometricalTests, ORIENT } from '@TRE/primitive-tests'

export class Polyhedron {
  centroid: Vector3 = new Vector3()
  vertices: Vector3[] = []
  faces: Face3[] = []

  constructor(vertices: Vector3[] = [], faces: Face3[] = []) {
    this.vertices = vertices
    this.faces = faces
  }

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
  public static convexHull(vertices: Vector3[]): Polyhedron | null {
    if (vertices.length < 4) return

    const { orient3d } = GeometricalTests
    const ch = Polyhedron.initConvexHull(vertices)
    if (!ch || !ch.vertices.length) return

    let vs = _.filter(vertices, v => {
      return _.every(ch.vertices, chv => !chv.equalTo(v))
    })
    const edgeKey = (a: Point, b: Point) => {
      return `${a.x}-${a.y}-${a.z}-${b.x}-${b.y}-${b.z}`
    }

    _.each(vs, v => {
      const visibleFaces = _.filter(ch.faces, f => {
        return orient3d(f.a, f.b, f.c, v) === ORIENT.COUNTERCLOCKWISE
      })

      if (visibleFaces.length === 0) return

      // TODO make it better with a conflict graph
      const horizonMap: any = {}
      _.each(visibleFaces, f => {
        const kab = edgeKey(f.a, f.b)
        const kba = edgeKey(f.b, f.a)
        const kbc = edgeKey(f.b, f.c)
        const kcb = edgeKey(f.c, f.b)
        const kca = edgeKey(f.c, f.a)
        const kac = edgeKey(f.a, f.c)

        let removeAB = false
        let removeBC = false
        let removeCA = false
        if (horizonMap[kab]) (delete horizonMap[kab]) && (removeAB = true)
        if (horizonMap[kba]) (delete horizonMap[kba]) && (removeAB = true)
        if (!removeAB) horizonMap[kab] = [f.a, f.b]

        if (horizonMap[kbc]) (delete horizonMap[kbc]) && (removeBC = true)
        if (horizonMap[kcb]) (delete horizonMap[kcb]) && (removeBC = true)
        if (!removeBC) horizonMap[kbc] = [f.b, f.c]

        if (horizonMap[kca]) (delete horizonMap[kca]) && (removeCA = true)
        if (horizonMap[kac]) (delete horizonMap[kac]) && (removeCA = true)
        if (!removeCA) horizonMap[kca] = [f.c, f.a]
      })

      const newFaces = _.map(horizonMap, (edge) => {
        const [a, b] = edge
        return new Face3(a, b, v)
      })

      ch.faces = _.filter(ch.faces, f => {
        return _.every(visibleFaces, vf => !vf.equalTo(f))
      })
      ch.faces = [...ch.faces, ...newFaces]
    })

    ch.vertices = _.uniqWith(
      _.flatten(_.map(ch.faces, f => [f.a, f.b, f.c])),
      (v1, v2) => v1.equalTo(v2)
    )

    return ch
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

    if (!p4)
      throw new Error('[Polyhedron.initConvexHull]: All vertices are coplanar.')

    return new Polyhedron([p1, p2, p3, p4], [
      new Face3(p1, p3, p2),
      new Face3(p1, p2, p4),
      new Face3(p2, p3, p4),
      new Face3(p3, p1, p4),
    ])
  }
}
