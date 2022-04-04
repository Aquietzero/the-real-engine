import * as THREE from 'three'
import * as _ from 'lodash'
import { Vector3 } from '@TRE/math'
import { AABB } from '@TRE/bounding-volumes'
import { PrimitiveTests } from '@TRE/primitive-tests'
import { Sphere, Plane } from '@TRE/primitive'
import {
  CoordinateHelper, BoxHelper, PlaneHelper,
} from '@TRE/playground/primitive-helpers'


export default {
  description: 'A bunch of vectors.',
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new CoordinateHelper()
    g.add(c.obj)

    const aabb1 = new AABB(new Vector3(0, 0, 0), new Vector3(1, 2, 1))
    const aabb1Helper = new BoxHelper(aabb1.center, aabb1.radius)
    g.add(aabb1Helper.obj)

    const aabb2 = new AABB(new Vector3(5, 5, -5), new Vector3(1, 2, 1))
    const aabb2Helper = new BoxHelper(aabb2.center, aabb2.radius)
    g.add(aabb2Helper.obj)

    const dir = new Vector3(1, 1, -1)

    _.times(10, (n: number) => {
      const p = new Plane(dir, n*2)
      const hitS1P = PrimitiveTests.testAABBPlane(aabb1, p)
      const hitS2P = PrimitiveTests.testAABBPlane(aabb2, p)
      const color = hitS1P || hitS2P ? 0xff0000 : 0x000000
      const pHelper = new PlaneHelper(p, { color, showNormal: false })
      g.add(pHelper.obj)
    })
    app.scene.add(g)
    return g
  }
}
