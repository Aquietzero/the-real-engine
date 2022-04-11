import * as _ from 'lodash'
import * as THREE from 'three'
import { Vector3 } from '@TRE/math'
import { ClosestPoint } from '@TRE/primitive-tests'
import { Plane, Point } from '@TRE/primitive'
import { CoordinateHelper, PlaneHelper, PointHelper, RayHelper } from '@TRE/playground/primitive-helpers'

export default {
  description: 'A bunch of vectors.',
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new CoordinateHelper()
    g.add(c.obj)

    const plane = new Plane(new Vector3(1, 2, 1), 3)
    const planeHelper = new PlaneHelper(plane)
    g.add(planeHelper.obj)

    const range = 3
    const random = () => Math.floor(-range + Math.random() * 2*range)

    _.times(10, () => {
      const p = new Point(random(), random(), random())
      const cp = ClosestPoint.onPlaneToPoint(plane, p)

      const pHelper = new PointHelper(p, { color: 0x0000ff })
      const cpHelper = new PointHelper(cp, { color: 0xff0000 })
      const rayHelper = new RayHelper(p, cp, { showArrow: false })

      g.add(pHelper.obj)
      g.add(cpHelper.obj)
      g.add(rayHelper.obj)
    })


    app.scene.add(g)
    return g
  }
}
