import * as THREE from 'three'
import * as _ from 'lodash'
import { Vector3 } from '@TRE/math'
import { AABB } from '@TRE/bounding-volumes'
import { PrimitiveTests } from '@TRE/primitive-tests'
import { Triangle, Plane } from '@TRE/primitive'
import {
  CoordinateHelper, BoxHelper, TriangleHelper,
} from '@TRE/playground/primitive-helpers'


export default {
  description: 'A bunch of vectors.',
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new CoordinateHelper()
    g.add(c.obj)

    const numOfAABBs = 3
    const aabbs = _.times(numOfAABBs, (n: number) => {
      const theta = Math.PI*2*n/numOfAABBs
      const aabb = new AABB(
        new Vector3(5*Math.cos(theta), 0, 5*Math.sin(theta)),
        new Vector3(1, 1, 1)
      )

      const aabbHelper = new BoxHelper(aabb.center, aabb.radius)
      g.add(aabbHelper.obj)

      return aabb
    })

    const numOfTriangles = 10
    _.times(numOfTriangles, (n: number) => {
      const theta = Math.PI*2*n/numOfTriangles
      const delta = Math.PI/(numOfTriangles + 2)
      const t1 = new Triangle(
        new Vector3(5*Math.cos(theta - delta), -0.5, 5*Math.sin(theta - delta)),
        new Vector3(5*Math.cos(theta), 0.5, 5*Math.sin(theta)),
        new Vector3(5*Math.cos(theta + delta), -0.5, 5*Math.sin(theta + delta)),
      )
      const t2 = new Triangle(
        new Vector3(5*Math.cos(theta - delta), 1, 5*Math.sin(theta - delta)),
        new Vector3(5*Math.cos(theta), 2, 5*Math.sin(theta)),
        new Vector3(5*Math.cos(theta + delta), 1, 5*Math.sin(theta + delta)),
      )

      const hit1 = _.some(aabbs, aabb => {
        return PrimitiveTests.testAABBTriangle(aabb, t1)
      })
      const t1Helper = new TriangleHelper(t1, { color: hit1 ? 0xff0000 : 0x000000 })
      g.add(t1Helper.obj)

      const hit2 = _.some(aabbs, aabb => {
        return PrimitiveTests.testAABBTriangle(aabb, t2)
      })
      const t2Helper = new TriangleHelper(t2, { color: hit2 ? 0xff0000 : 0x000000 })
      g.add(t2Helper.obj)
    })

    app.scene.add(g)
    return g
  }
}
