import * as THREE from 'three'
import * as _ from 'lodash'
import { Vector3 } from '@TRE/math'
import { Sphere as BoundingSphere } from '@TRE/bounding-volumes'
import { Coordinate, Point, Sphere } from '@TRE/playground/primitive-helpers'

export default {
  description: 'A bunch of connected vectors.',
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new Coordinate()
    g.add(c.obj)

    const N = 30
    const range = 5
    const random = () => Math.floor(-range + Math.random() * 2*range)

    const points = _.times(N, () => new Vector3(random(), random(), random()))

    _.each(points, p => {
      const point = new Point(p)
      g.add(point.obj)
    })

    const bs = BoundingSphere.calculateSphere(points)
    const sphere = new Sphere(bs.center, bs.radius, { color: 0x999999 })
    g.add(sphere.obj)

    app.scene.add(g)
    return g
  }
}
