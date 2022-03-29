import * as THREE from 'three'
import { Vector3 } from '@TRE/math'
import { Coordinate, Ray } from '@TRE/playground/primitive-helpers'

export default {
  description: 'A bunch of connected vectors.',
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new Coordinate()
    g.add(c.obj)

    const origin = new Vector3(0, 0, 0)
    const v1 = new Vector3(1, 1, 1)
    const v2 = new Vector3(1, 3, 2)
    const v3 = new Vector3(-1, -2, 5)
    const v4 = new Vector3(-3, 2, 3)
    const v5 = new Vector3(-2, 4, -2)

    const r1 = new Ray(origin, v1)
    const r2 = new Ray(v1, v2)
    const r3 = new Ray(v2, v3)
    const r4 = new Ray(v3, v4)
    const r5 = new Ray(v4, v5)

    g.add(r1.obj)
    g.add(r2.obj)
    g.add(r3.obj)
    g.add(r4.obj)
    g.add(r5.obj)

    app.scene.add(g)
    return g
  }
}
