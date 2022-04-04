import * as _ from 'lodash'
import * as THREE from 'three'
import { Vector3 } from '@TRE/math'
import { Plane, Segment, Point } from '@TRE/primitive'
import { Intersection } from '@TRE/primitive-tests'
import { CoordinateHelper, PlaneHelper, PointHelper, RayHelper } from '@TRE/playground/primitive-helpers'

export default {
  description: 'A bunch of vectors.',
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new CoordinateHelper()
    g.add(c.obj)

    const plane = new Plane(new Vector3(0, 1, 0), 3)
    const planeHelper = new PlaneHelper(plane)
    g.add(planeHelper.obj)

    _.times(10, () => {
      const p1 = new Point(_.random(-5, 5), _.random(4, 6), _.random(-5, 5))
      const p2 = new Point(_.random(-5, 5), _.random(-2, 2), _.random(-5, 5))
      const s = new Segment(p1, p2)
      const p = Intersection.ofSegmentAndPlane(s, plane)

      const pHelper = new PointHelper(p, { color: 0xff0000 })
      const sHelper = new RayHelper(s.a, s.b, { showArrow: false })
      g.add(sHelper.obj)
      g.add(pHelper.obj)
    })

    app.scene.add(g)
    return g
  }
}
