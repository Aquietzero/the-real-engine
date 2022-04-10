import * as THREE from 'three'
import { Vector3 } from '@TRE/math'
import { Sphere } from '@TRE/bounding-volumes'
import { CoordinateHelper, SphereHelper } from '@TRE/playground/primitive-helpers'
import ModelsManager from '@TRE/playground/lib/models-manager'

export default {
  description: 'A bunch of connected vectors.',
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new CoordinateHelper()
    g.add(c.obj)

    ModelsManager.load('Mario', (obj: THREE.Object3D) => {
      const mario = obj
      const points = []
      const raw = (mario.children[0] as any).geometry.attributes.position.array
      for (let i = 0; i < raw.length - 2; i = i + 3) {
        points.push(new Vector3(
          raw[i] * mario.scale.x,
          raw[i + 1] * mario.scale.y,
          raw[i + 2] * mario.scale.z
        ))
      }
      const s = Sphere.calculateSphere(points)
      const sphere = new SphereHelper(s)
      g.add(sphere.obj)
      g.add(mario)
    }, {
      beforeCache: (obj: THREE.Object3D) => {
        const m4 = new THREE.Matrix4()
        const s = 0.05
        m4.set(
          s, 0, 0, 0,
          0, s, 0, 0,
          0, 0, s, 0,
          0, 0, 0, 1
        )
        obj.applyMatrix4(m4)
        return obj
      }
    })

    app.scene.add(g)
    return g
  }
}
