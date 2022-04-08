import * as THREE from 'three'
import * as _ from 'lodash'
import { Vector3 } from '@TRE/math'
import { AABB } from '@TRE/bounding-volumes'
import { Point } from '@TRE/primitive'
import { CoordinateHelper, PointHelper, BoxHelper, RayHelper } from '@TRE/playground/primitive-helpers'
import { BinaryBVTree } from '@TRE/structures/bvtree'

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
    const bvtree = new BinaryBVTree(bodies)
    const palette = [
      0x000000,
      0x111111,
      0x222222,
      0x333333,
      0x444444,
      0x555555,
      0x666666,
      0x777777,
      0x888888,
      0x999999,
      0xAAAAAA,
      0xBBBBBB,
      0xCCCCCC,
      0xDDDDDD,
      0xEEEEEE,
    ]

    const height = bvtree.height()
    bvtree.traverse((node: any, context: any) => {
      const aabbHelper = new BoxHelper(node.bv.center, node.bv.radius, {
        color: palette[Math.floor(context.level/height*palette.length)],
      })
      g.add(aabbHelper.obj)
    })

    const { min, max } = AABB.mostSeparatedPoints(points)
    const r = new RayHelper(min, max)
    g.add(r.obj)


    app.scene.add(g)
    return g
  }
}
