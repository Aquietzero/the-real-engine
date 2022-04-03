import * as THREE from 'three'
import * as _ from 'lodash'
import { Vector3 } from '@TRE/math'
import { PrimitiveTests } from '@TRE/primitive-tests'
import { Sphere, Plane } from '@TRE/primitive'
import {
  CoordinateHelper, RayHelper, SphereHelper, PlaneHelper,
} from '@TRE/playground/primitive-helpers'


export default {
  description: 'A bunch of vectors.',
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new CoordinateHelper()
    g.add(c.obj)

    const s1 = new Sphere(new Vector3(0, 0, 0), 1)
    const s1Helper = new SphereHelper(s1)
    g.add(s1Helper.obj)

    const s2 = new Sphere(new Vector3(3, 3, -3), 1)
    const s2Helper = new SphereHelper(s2)
    g.add(s2Helper.obj)

    const dir = new Vector3(1, 1, -1)

    _.times(10, (n: number) => {
      const p = new Plane(dir, n*2)
      const hitS1P = PrimitiveTests.testSpherePlane(s1, p)
      const hitS2P = PrimitiveTests.testSpherePlane(s2, p)
      const color = hitS1P || hitS2P ? 0xff0000 : 0x000000
      const pHelper = new PlaneHelper(p, { color, showNormal: false })
      g.add(pHelper.obj)
    })
    app.scene.add(g)
    return g
  }
}
