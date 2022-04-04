import * as THREE from 'three'
import * as _ from 'lodash'
import { Vector3 } from '@TRE/math'
import { AABB } from '@TRE/bounding-volumes'
import { PrimitiveTests } from '@TRE/primitive-tests'
import { Segment } from '@TRE/primitive'
import {
  CoordinateHelper, BoxHelper, RayHelper,
} from '@TRE/playground/primitive-helpers'


export default {
  description: 'A bunch of vectors.',
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new CoordinateHelper()
    g.add(c.obj)

    const aabb = new AABB(new Vector3(0, 0, 0), new Vector3(2, 2, 2))
    const aabbHelper = new BoxHelper(aabb.center, aabb.radius)
    g.add(aabbHelper.obj)

    _.times(10, () => {
      const s = new Segment(
        new Vector3(_.random(-4, 4), _.random(0, 4), _.random(-4, 4)),
        new Vector3(_.random(-4, 4), _.random(0, 4), _.random(-4, 4)),
      )
      const hit = PrimitiveTests.testSegmentAABB(s, aabb)
      const sHelper = new RayHelper(s.a, s.b, {
        color: hit ? 0xff0000 : 0x000000,
        showArrow: false,
      })
      g.add(sHelper.obj)
    })
    app.scene.add(g)
    return g
  }
}
