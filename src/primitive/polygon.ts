import * as _ from 'lodash'
import { Vector2, Vector3 } from '@TRE/math'
import { Plane, Point, Segment } from '@TRE/primitive'
import {
  Intersection,
  GeometricalTests, ORIENT, POSITION,
} from '@TRE/primitive-tests'

export class Polygon {
  vertices: Vector3[] = []

  constructor(vertices: Vector3[] = []) {
    this.vertices = vertices
  }

  get centroid(): Vector3 {
    const sum = _.reduce(this.vertices, (v, sum) => {
      return sum.add(v)
    }, new Vector3())
    return sum.div(this.vertices.length)
  }

  splitByPlane(p: Plane): { front: Polygon, back: Polygon } {
    const frontVertices: Point[] = []
    const backVertices: Point[] = []
    const { classifyPointToPlane } = GeometricalTests

    let a: Point = _.last(this.vertices)
    let aSide = classifyPointToPlane(a, p)

    _.each(this.vertices, b => {
      const bSide = classifyPointToPlane(b, p)
      if (bSide === POSITION.FRONT) {
        if (aSide === POSITION.BEHIND) {
          const i = Intersection.ofSegmentAndPlane(new Segment(a, b), p)
          // if (classifyPointToPlane(i, p) === POSITION.INSIDE)
          //   throw Error('[Polygon.splitByPlane]: edge straddles')
          frontVertices.push(i)
          backVertices.push(i)
        }
        frontVertices.push(b)
      } else if (bSide === POSITION.BEHIND) {
        if (aSide === POSITION.FRONT) {
          const i = Intersection.ofSegmentAndPlane(new Segment(a, b), p)
          // if (classifyPointToPlane(i, p) === POSITION.INSIDE)
          //   throw Error('[Polygon.splitByPlane]: edge straddles')
          frontVertices.push(i)
          backVertices.push(i)
        } else if (aSide === POSITION.INSIDE) {
          backVertices.push(a)
        }
        backVertices.push(b)
      } else {
        frontVertices.push(b)
        if (aSide === POSITION.BEHIND) {
          backVertices.push(b)
        }
      }

      a = b
      aSide = bSide
    })

    return {
      front: new Polygon(frontVertices),
      back: new Polygon(backVertices),
    }
  }

  public static random(configs: any = {}): Polygon {
    const { radius = 5, range = 5, n = 20 } = configs
    const random = (r: number) => -r + Math.random() * 2*r
    const e1 = new Point(random(radius), random(radius), random(radius)).normalize()
    const e2 = new Point(random(radius), random(radius), random(radius)).normalize()
    const pos = new Point(random(range), random(range), random(range))
    const points = _.times(n, () => {
      const c1 = random(radius)
      const c2 = random(radius)
      return e1.mul(c1).add(e2.mul(c2)).add(pos)
    })
    return Polygon.convexHull(points)
  }

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
