import * as THREE from 'three'
import { Vector3 } from '@TRE/math'
import { CoordinateHelper, RayHelper } from '@TRE/playground/primitive-helpers'

export default {
  description: 'A bunch of vectors.',
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new CoordinateHelper()
    g.add(c.obj)

    const R = 6
    for (let x = -R; x <= R; x += 1) {
      for (let y = -R; y <= R; y += 1) {
        const z = R*R - x*x - y*y
        if (z < 0) continue
        const v1 = new Vector3(x, y, Math.sqrt(z))
        const r1 = new RayHelper(new Vector3(0, 0, 0), v1, { color: 0xff0000 })
        const v2 = new Vector3(x, y, Math.sqrt(z)).negate()
        const r2 = new RayHelper(new Vector3(0, 0, 0), v2, { color: 0x0000ff })
        g.add(r1.obj)
        g.add(r2.obj)
      }
    }

    app.scene.add(g)
    return g
  }
}
