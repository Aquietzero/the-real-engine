import * as THREE from 'three'
import * as _ from 'lodash'
import { Vector3 } from '@TRE/math'
import { AABB } from '@TRE/bounding-volumes'
import { Coordinate, Point, Box } from '@TRE/playground/primitive-helpers'
import ModelsManager from '@TRE/playground/lib/models-manager'

export default {
  description: 'A bunch of connected vectors.',
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new Coordinate()
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
      const aabb = AABB.calculateAABB(points)
      const box = new Box(aabb.center, aabb.radius, { color: 0x0000ff })
      g.add(box.obj)
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
