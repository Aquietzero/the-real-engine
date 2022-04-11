import * as _ from 'lodash'
import * as THREE from 'three'
import { Point, Polyhedron } from '@TRE/primitive'
import { CoordinateHelper, PointHelper, RayHelper, PolyhedronHelper } from '@TRE/playground/primitive-helpers'

export default {
  description: 'A bunch of vectors.',
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new CoordinateHelper()
    g.add(c.obj)

    const n = 50
    const range = 5
    const random = () => Math.floor(-range + Math.random() * 2*range)

    const points = _.times(n, () => new Point(random(), random(), random()))
    const polyhedron = Polyhedron.convexHull(points)
    const pHelper = new PolyhedronHelper(polyhedron)
    g.add(pHelper.obj)

    const otherPoints = _.filter(points, p => {
      return _.every(polyhedron.vertices, v => !v.equalTo(p))
    })
    _.each(otherPoints, p => {
      const pHelper = new PointHelper(p, { color: 0xff0000 })
      g.add(pHelper.obj)
    })
    _.each(polyhedron.vertices, p => {
      const pHelper = new PointHelper(p)
      g.add(pHelper.obj)
    })

    _.each(polyhedron.faces, f => {
      const nHelper = new RayHelper(f.centroid, f.centroid.add(f.normal), { color: 0x0000ff })
      g.add(nHelper.obj)
    })

    app.scene.add(g)
    return g
  }
}
