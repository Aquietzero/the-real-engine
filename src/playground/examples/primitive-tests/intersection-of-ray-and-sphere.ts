import * as _ from 'lodash'
import * as THREE from 'three'
import { ORIGIN } from '@TRE/math'
import { Sphere, Ray, Point } from '@TRE/primitive'
import { Intersection } from '@TRE/primitive-tests'
import { CoordinateHelper, SphereHelper, PointHelper, RayHelper } from '@TRE/playground/primitive-helpers'

export default {
  description: 'A bunch of vectors.',
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new CoordinateHelper()
    g.add(c.obj)

    const s = new Sphere(ORIGIN, 4)
    const sHelper = new SphereHelper(s)
    g.add(sHelper.obj)

    _.times(10, () => {
      const p1 = new Point(_.random(-3, 3), _.random(0, 6), _.random(-3, 3))
      const p2 = new Point(_.random(-3, 3), _.random(-6, 3), _.random(-3, 3))
      const r = new Ray(p1, p2.sub(p1).normalize())
      const p = Intersection.ofRayAndSphere(r, s)

      const pHelper = new PointHelper(p, { color: 0xff0000 })
      const rHelper = new RayHelper(p1, p2)
      g.add(rHelper.obj)
      g.add(pHelper.obj)
    })

    app.scene.add(g)
    return g
  }
}
