import * as _ from 'lodash'
import * as THREE from 'three'
import { Vector3, Quaternion, ORIGIN } from '@TRE/math'
import { CoordinateHelper, RayHelper } from '@TRE/playground/primitive-helpers'

export default {
  description: 'A bunch of vectors.',
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new CoordinateHelper()
    g.add(c.obj)

    const v = new Vector3(1, 2, 1)
    const vHelper = new RayHelper(ORIGIN, v)
    g.add(vHelper.obj)

    const rAxis = new Vector3(1, 1, 1)
    const rAxisHelper = new RayHelper(ORIGIN, rAxis, { color: 0xff0000 })
    g.add(rAxisHelper.obj)

    const steps = 10
    const dAngle = 2*Math.PI/steps

    _.times(steps, i => {
      //           -1
      // rotate qvq
      const q = Quaternion.fromAxisAngle(rAxis, dAngle * (i + 1))
      const vDir = Quaternion.fromVector(v).normalize()
      const p = q.mul(vDir).mul(q.conjugate()).toVector()
      const pHelper = new RayHelper(ORIGIN, p, { color: 0x0000ff })
      g.add(pHelper.obj)
    })

    app.scene.add(g)
    return g
  }
}
