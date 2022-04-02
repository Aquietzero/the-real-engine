import * as THREE from 'three'
import { Vector3 } from '@TRE/math'
import { Plane } from '@TRE/primitive'
import { CoordinateHelper, PlaneHelper } from '@TRE/playground/primitive-helpers'

export default {
  description: 'A bunch of vectors.',
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new CoordinateHelper()
    g.add(c.obj)

    const p = new Plane(new Vector3(1, 2, 1), 3)
    const plane = new PlaneHelper(p)

    g.add(plane.obj)
    app.scene.add(g)
    return g
  }
}
