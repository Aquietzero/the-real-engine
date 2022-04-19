import * as THREE from 'three'
import { Vector3 } from '@TRE/math'
import { Plane, Polyhedron } from '@TRE/primitive'
import { GJK } from '@TRE/primitive-tests'
import {
  CoordinateHelper, PolyhedronHelper,
} from '@TRE/playground/primitive-helpers'

export default {
  description: 'A bunch of connected vectors.',
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new CoordinateHelper()
    g.add(c.obj)

    const p1 = Polyhedron.random({ radius: 2, range: 3 })
    const p2 = Polyhedron.random({ radius: 2, range: 3 })

    const hit = GJK.testCollision(p1, p2)
    const color = hit ? 0xff0000 : 0x000000

    const p1Helper = new PolyhedronHelper(p1, { color })
    const p2Helper = new PolyhedronHelper(p2, { color })
    g.add(p1Helper.obj)
    g.add(p2Helper.obj)

    app.scene.add(g)
    return g
  }
}
