import * as _ from 'lodash'
import * as THREE from 'three'
import { Point, Polygon } from '@TRE/primitive'
import { CoordinateHelper, PointHelper, RayHelper, PolygonHelper } from '@TRE/playground/primitive-helpers'
import { Panel } from './panel'
import { Events } from '@TRE/core/events'

export default {
  description: 'A bunch of vectors.',
  panel: Panel,
  run(app: any): THREE.Group {
    let g: THREE.Group
    let points: Point[] = []

    const random = (range: number) => -range + Math.random() * 2*range
    const configs = {
      range: 5,
      n: 20,
      showPoints: true,
    }

    const randomPointsOnPlane = (n: number): Point[] => {
      const { range } = configs
      const e1 = new Point(random(range), random(range), random(range)).normalize()
      const e2 = new Point(random(range), random(range), random(range)).normalize()
      return _.times(n, () => {
        const c1 = random(range)
        const c2 = random(range)
        return e1.mul(c1).add(e2.mul(c2))
      })
    }

    const gen = (points: Point[] = []) => {
      if (g) {
        app.scene.remove(g)
      }

      g = new THREE.Group()
      const c = new CoordinateHelper()
      g.add(c.obj)

      const { showPoints } = configs

      const polygon = Polygon.convexHull(points)
      const pHelper = new PolygonHelper(polygon)
      g.add(pHelper.obj)

      _.each(polygon.vertices, p => {
        const pHelper = new PointHelper(p)
        g.add(pHelper.obj)
      })

      if (showPoints) {
        const otherPoints = _.filter(points, p => {
          return _.every(polygon.vertices, v => !v.equalTo(p))
        })
        _.each(otherPoints, p => {
          const pHelper = new PointHelper(p, { color: 0xff0000 })
          g.add(pHelper.obj)
        })
      }

      app.scene.add(g)
    }

    Events.on('ConvexHull2DExample:numOfPoints', n => {
      configs.n = n
      points = randomPointsOnPlane(configs.n)
      gen(points)
    })

    Events.on('ConvexHull2DExample:showPoints', showPoints => {
      configs.showPoints = showPoints
      gen(points)
    })

    Events.on('ConvexHull2DExample:range', range => {
      configs.range = range
      points = randomPointsOnPlane(configs.n)
      gen(points)
    })

    points = randomPointsOnPlane(configs.n)
    gen(points)

    return g
  }
}
