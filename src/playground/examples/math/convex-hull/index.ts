import * as _ from 'lodash'
import * as THREE from 'three'
import { Point, Polyhedron } from '@TRE/primitive'
import { CoordinateHelper, PointHelper, RayHelper, PolyhedronHelper } from '@TRE/playground/primitive-helpers'
import { Panel } from './panel'
import { Events } from '@TRE/core/events'

export default {
  description: 'A bunch of vectors.',
  panel: Panel,
  run(app: any): THREE.Group {
    let g: THREE.Group
    let points: Point[] = []

    const random = (range: number) => Math.floor(-range + Math.random() * 2*range)
    const configs = {
      range: 5,
      n: 20,
      showNormal: true,
      showPoints: true,
    }

    const gen = (points: Point[] = []) => {
      if (g) {
        app.scene.remove(g)
      }

      g = new THREE.Group()
      const c = new CoordinateHelper()
      g.add(c.obj)

      const { showNormal, showPoints } = configs


      const polyhedron = Polyhedron.convexHull(points)
      const pHelper = new PolyhedronHelper(polyhedron)
      g.add(pHelper.obj)

      _.each(polyhedron.vertices, p => {
        const pHelper = new PointHelper(p)
        g.add(pHelper.obj)
      })

      if (showPoints) {
        const otherPoints = _.filter(points, p => {
          return _.every(polyhedron.vertices, v => !v.equalTo(p))
        })
        _.each(otherPoints, p => {
          const pHelper = new PointHelper(p, { color: 0xff0000 })
          g.add(pHelper.obj)
        })
      }

      if (showNormal) {
        _.each(polyhedron.faces, f => {
          const nHelper = new RayHelper(f.centroid, f.centroid.add(f.normal), { color: 0x0000ff })
          g.add(nHelper.obj)
        })
      }

      app.scene.add(g)
    }

    Events.on('ConvexHullExample:numOfPoints', n => {
      const { range } = configs
      points = _.times(n, () => new Point(random(range), random(range), random(range)))
      gen(points)
    })

    Events.on('ConvexHullExample:showNormal', showNormal => {
      configs.showNormal = showNormal
      gen(points)
    })

    Events.on('ConvexHullExample:showPoints', showPoints => {
      configs.showPoints = showPoints
      gen(points)
    })

    Events.on('ConvexHullExample:range', range => {
      configs.range = range
      points = _.times(configs.n, () => new Point(random(range), random(range), random(range)))
      gen(points)
    })

    const { range } = configs
    points = _.times(20, () => new Point(random(range), random(range), random(range)))
    gen(points)

    return g
  }
}
