import * as _ from 'lodash'
import { Vector2, Vector3 } from '@TRE/math'
import { Plane, Point } from '@TRE/primitive'
import { GeometricalTests, ORIENT } from '@TRE/primitive-tests'

export class Polygon {
  centroid: Vector3 = new Vector3()
  vertices: Vector3[] = []

  constructor(vertices: Vector3[] = []) {
    this.vertices = vertices
  }

  // splitByPlane(p: Plane): { front: Polygon, back: Polygon } {
  //   const frontVertices = []
  //   const backVertices = []

  //   const a: Point = _.last(this.vertices)
  //   const aSide = 
  // }

  public static convexHull(vertices: Vector3[]): Polygon | null {
    if (vertices.length < 3) return

    const sorted = _.sortBy(vertices, 'x')
    const minY = Math.min(..._.map(vertices, 'y'))
    const { orient2d } = GeometricalTests

    const getLink = (sorted: Vector3[]): Vector3[] => {
      const [v0, v1, ...vs] = sorted
      const link = [v0, v1]
      _.each(vs, v => {
        let first = link[link.length - 1]
        let second = link[link.length - 2]

        // determine orientation of points in xy plane.
        // sorted by x and translate all points above the
        // y axis. (this is very important)
        while(second && orient2d(
          new Vector2(first.x, first.y - minY),
          new Vector2(second.x, second.y - minY),
          new Vector2(v.x, v.y - minY),
        ) != ORIENT.COUNTERCLOCKWISE) {
          link.pop()

          first = link[link.length - 1]
          second = link[link.length - 2]
        }
        link.push(v)
      })
      return link
    }

    const link = [
      ...getLink(sorted),
      ...getLink(sorted.reverse()),
    ]
    // the last vertice is the same as the first one.
    link.pop()

    return new Polygon(link)
  }
}
