import * as THREE from 'three'
import * as _ from 'lodash'
import { Vector3 } from '@TRE/math'
import { ClosestPoint } from '@TRE/primitive-tests'
import { Segment, Point } from '@TRE/primitive'
import { CoordinateHelper, RayHelper, PointHelper } from '@TRE/playground/primitive-helpers'

export default {
  description: 'A bunch of vectors.',
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new CoordinateHelper()
    g.add(c.obj)

    const range = 5
    const random = () => Math.floor(-range + Math.random() * 2*range)

    const segment = new Segment(
      new Vector3(1, 2, 5), new Vector3(-3, 7, -6),
    )
    const rayHelper = new RayHelper(segment.a, segment.b, {
      showArrow: false
    })
    g.add(rayHelper.obj)

    _.times(10, () => {
      const p1 = new Point(random(), random(), random())
      const p2 = ClosestPoint.onSegmentToPoint(segment, p1)

      const p1Helper = new PointHelper(p1, { color: 0x0000ff })
      const p2Helper = new PointHelper(p2, { color: 0xff0000 })
      const rHelper = new RayHelper(p1, p2, { showArrow: false })

      g.add(p1Helper.obj)
      g.add(p2Helper.obj)
      g.add(rHelper.obj)
    })

    app.scene.add(g)
    return g
  }
}
