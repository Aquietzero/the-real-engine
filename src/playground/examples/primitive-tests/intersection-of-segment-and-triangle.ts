import * as _ from 'lodash'
import * as THREE from 'three'
import { Vector3 } from '@TRE/math'
import { Point, Segment, Triangle } from '@TRE/primitive'
import { Intersection } from '@TRE/primitive-tests'
import { CoordinateHelper, TriangleHelper, PointHelper, RayHelper } from '@TRE/playground/primitive-helpers'

export default {
  description: 'A bunch of vectors.',
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new CoordinateHelper()
    g.add(c.obj)

    const t = new Triangle(
      new Vector3(5, 1, 6),
      new Vector3(-4, 4, 0),
      new Vector3(3, 2, -4),
    )
    const tHelper = new TriangleHelper(t)
    g.add(tHelper.obj)

    // XXX The order of ABC and the direction of the segment affects the
    // result of the intersection.
    _.times(10, () => {
      const s = new Segment(
        new Point(_.random(-3, 3), _.random(-5, 0), _.random(-3, 3)),
        new Point(_.random(-3, 3), _.random(0, 8), _.random(-3, 3))
      )
      const cp = Intersection.ofSegmentAndTriangle(s, t)

      if (cp) {
        const cpHelper = new PointHelper(cp, { color: 0xff0000 })
        g.add(cpHelper.obj)
      }
      const sHelper = new RayHelper(s.a, s.b, { showArrow: false })
      g.add(sHelper.obj)
    })

    app.scene.add(g)
    return g
  }
}
