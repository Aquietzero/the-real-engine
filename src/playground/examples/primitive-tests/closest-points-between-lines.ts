import * as THREE from 'three'
import * as _ from 'lodash'
import { Vector3 } from '@TRE/math'
import { ClosestPoint } from '@TRE/primitive-tests'
import { Line, Point } from '@TRE/primitive'
import { CoordinateHelper, RayHelper, PointHelper } from '@TRE/playground/primitive-helpers'

export default {
  description: 'A bunch of vectors.',
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new CoordinateHelper()
    g.add(c.obj)

    const range = 5
    const random = () => Math.floor(-range + Math.random() * 2*range)
    const randomVector = () => (new Vector3(
      random(), random(), random()
    ))

    const l1 = new Line(randomVector(), randomVector())
    const l2 = new Line(randomVector(), randomVector())
    const l1Helper = new RayHelper(
      l1.parametric(-20),
      l1.parametric(20),
      { showArrow: false }
    )
    const l2Helper = new RayHelper(
      l2.parametric(-20),
      l2.parametric(20),
      { showArrow: false }
    )
    g.add(l1Helper.obj)
    g.add(l2Helper.obj)

    const { p1, p2 } = ClosestPoint.betweenLines(l1, l2)

    const p1Helper = new PointHelper(p1, { color: 0x0000ff })
    const p2Helper = new PointHelper(p2, { color: 0xff0000 })
    const rHelper = new RayHelper(p1, p2, { showArrow: false })

    g.add(p1Helper.obj)
    g.add(p2Helper.obj)
    g.add(rHelper.obj)

    app.scene.add(g)
    return g
  }
}
