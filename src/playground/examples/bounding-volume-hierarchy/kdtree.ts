import * as THREE from 'three'
import * as _ from 'lodash'
import { Vector3 } from '@TRE/math'
import { AABB } from '@TRE/bounding-volumes'
import { CoordinateHelper, PointHelper, BoxHelper, RayHelper } from '@TRE/playground/primitive-helpers'
import { KDTree } from '@TRE/structures/kdtree'

export default {
  description: 'A bunch of connected vectors.',
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new CoordinateHelper()
    g.add(c.obj)

    const N = 30
    const range = 5
    const random = () => Math.floor(-range + Math.random() * 2*range)

    const bodies = _.times(N, () => {
      const point = new Vector3(random(), random(), random())
      return {
        point,
        bv: new AABB(point, new Vector3(0.1, 0.1, 0.1))
      }
    })

    _.each(bodies, body => {
      const pHelper = new PointHelper(body.point, { color: 0xff0000 })
      g.add(pHelper.obj)
    })

    const points = _.map(bodies, 'point')
    const kdtree = new KDTree(bodies)
    console.log(kdtree)

    app.scene.add(g)
    return g
  }
}
