import * as _ from 'lodash'
import * as THREE from 'three'
import { Vector3 } from '@TRE/math'
import { Plane } from '@TRE/primitive'
import { Intersection } from '@TRE/primitive-tests'
import { CoordinateHelper, PlaneHelper, PointHelper, RayHelper } from '@TRE/playground/primitive-helpers'

export default {
  description: 'A bunch of vectors.',
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new CoordinateHelper()
    g.add(c.obj)

    const p1 = new Plane(
      new Vector3(_.random(-1, 1), _.random(-1, 1), _.random(-1, 1)),
      _.random(-1, 1)
    )
    const p2 = new Plane(
      new Vector3(_.random(-1, 1), _.random(-1, 1), _.random(-1, 1)),
      _.random(-1, 1)
    )
    const p1Helper = new PlaneHelper(p1)
    const p2Helper = new PlaneHelper(p2)
    g.add(p1Helper.obj)
    g.add(p2Helper.obj)

    const l = Intersection.ofPlaneAndPlane(p1, p2)
    if (l) {
      const lHelper = new RayHelper(
        l.parametric(-20), l.parametric(20), { color: 0xff0000 }
      )
      const pHelper = new PointHelper(l.p, { color: 0xff0000 })
      g.add(lHelper.obj)
      g.add(pHelper.obj)
    }

    app.scene.add(g)
    return g
  }
}
