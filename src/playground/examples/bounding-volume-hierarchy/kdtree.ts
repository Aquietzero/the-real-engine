import * as THREE from 'three'
import * as _ from 'lodash'
import { Vector3 } from '@TRE/math'
import { AABB } from '@TRE/bounding-volumes'
import { Plane } from '@TRE/primitive'
import { CoordinateHelper, PointHelper, PlaneHelper, BoxHelper } from '@TRE/playground/primitive-helpers'
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

    const kdtree = new KDTree(bodies)
    const points = _.map(bodies, 'point')
    console.log(kdtree)
    kdtree.traverse((node: any, context: any) => {
      // let axis = new Vector3(1, 0, 0)
      // if (node.axis === 'y') axis = new Vector3(0, 1, 0)
      // if (node.axis === 'z') axis = new Vector3(0, 0, 1)
      // const pHelper = new PlaneHelper(
      //   new Plane(axis, node.value), {
      //     showNormal: false,
      //   }
      // )
      // g.add(pHelper.obj)
    }, (node: any, context: any) => {
      switch (context.dir) {
        case 'root':
          context.aabb = AABB.calculateAABB(points)
          break
        case 'left':
          context.aabb = context.aabb.clamp(node.axis, 'max', node.value)
          break
        case 'right':
          context.aabb = context.aabb.clamp(node.axis, 'min', node.value)
          break
      }

      const aabbHelper = new BoxHelper(
        context.aabb.center, context.aabb.radius, { showFace: false }
      )
      g.add(aabbHelper.obj)
      return context
    })

    app.scene.add(g)
    return g
  }
}
