import * as _ from 'lodash'
import * as THREE from 'three'
import { Vector3 } from '@TRE/math'
import { Point, Line, Triangle } from '@TRE/primitive'
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
      new Vector3(3, 2, -4),
      new Vector3(-4, 4, 0),
    )
    const tHelper = new TriangleHelper(t)
    g.add(tHelper.obj)

    _.times(10, () => {
      const p = new Point(_.random(-1, 1), _.random(-1, 1), _.random(-1, 1))
      const dir = new Vector3(_.random(-1, 1), _.random(-1, 1), _.random(-1, 1))
      const l = new Line(p, dir)
      const cp = Intersection.ofLineAndTriangle(l, t)

      if (cp) {
        const cpHelper = new PointHelper(cp, { color: 0xff0000 })
        g.add(cpHelper.obj)
      }
      const lHelper = new RayHelper(l.parametric(-20), l.parametric(20))
      g.add(lHelper.obj)
    })

    app.scene.add(g)
    return g
  }
}
