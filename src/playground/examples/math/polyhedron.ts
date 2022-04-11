import * as _ from 'lodash'
import * as THREE from 'three'
import { Vector3 } from '@TRE/math'
import { Point, Polyhedron } from '@TRE/primitive'
import { CoordinateHelper, PointHelper, PolyhedronHelper } from '@TRE/playground/primitive-helpers'

export default {
  description: 'A bunch of vectors.',
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new CoordinateHelper()
    g.add(c.obj)

    const range = 5
    const random = () => Math.floor(-range + Math.random() * 2*range)

    const points = _.times(10, () => new Point(random(), random(), random()))
    const p = Polyhedron.initConvexHull(points)
    const pHelper = new PolyhedronHelper(p)
    g.add(pHelper.obj)

    _.each(points, p => {
      const pHelper = new PointHelper(p, { color: 0xff0000 })
      g.add(pHelper.obj)
    })

    app.scene.add(g)
    return g
  }
}
