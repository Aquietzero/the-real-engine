import * as _ from 'lodash'
import * as THREE from 'three'
import { Vector3, ORIGIN } from '@TRE/math'
import { AABB } from '@TRE/bounding-volumes'
import { Ray, Point } from '@TRE/primitive'
import { Intersection } from '@TRE/primitive-tests'
import { CoordinateHelper, BoxHelper, PointHelper, RayHelper } from '@TRE/playground/primitive-helpers'

export default {
  description: 'A bunch of vectors.',
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new CoordinateHelper()
    g.add(c.obj)

    const aabb = new AABB(ORIGIN, new Vector3(2, 2, 2))
    const aabbHelper = new BoxHelper(aabb.center, aabb.radius)
    g.add(aabbHelper.obj)

    _.times(10, () => {
      const p1 = new Point(_.random(-3, 3), _.random(0, 6), _.random(-3, 3))
      const p2 = new Point(_.random(-3, 3), _.random(-6, 3), _.random(-3, 3))
      const r = new Ray(p1, p2.sub(p1).normalize())
      const { min, max } = Intersection.ofRayAndAABB(r, aabb)

      if (min) {
        const pMinHelper = new PointHelper(min, { color: 0xff0000 })
        g.add(pMinHelper.obj)
      }
      if (max) {
        const pMaxHelper = new PointHelper(max, { color: 0xff0000 })
        g.add(pMaxHelper.obj)
      }
      const rHelper = new RayHelper(r.p, r.parametric(10))
      g.add(rHelper.obj)
    })

    app.scene.add(g)
    return g
  }
}
