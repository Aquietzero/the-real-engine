import * as THREE from 'three'
import { Events } from '@TRE/core/events'
import { Vector3, Matrix4, ORIGIN, EPSILON } from '@TRE/math'
import { CoordinateHelper, RayHelper } from '@TRE/playground/primitive-helpers'
import ModelsManager from '@TRE/playground/lib/models-manager'
import { Panel } from './panel'

export default {
  description: 'Matrix transformations.',
  panel: Panel,
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new CoordinateHelper()
    g.add(c.obj)

    const light = new THREE.PointLight(0xffffff, 0.2)
    light.position.set(100, 200, 100)
    g.add(light)

    let mario: THREE.Object3D
    let dir: Vector3 = new Vector3(0, 0, 5)
    let dirHelper = new RayHelper(ORIGIN, dir)
    g.add(dirHelper.obj)

    ModelsManager.load('Mario', (obj: THREE.Object3D) => {
      mario = obj
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

    Events.on('scale', ({ x, y, z }) => {
      const scale = Matrix4.fromScale(x, y, z)
      const m4 = new THREE.Matrix4()
      m4.set(...scale.e)
      mario.applyMatrix4(m4)
    })

    Events.on('translate', ({ x, y, z }) => {
      const translate = Matrix4.fromTranslate(x, y, z)
      const m4 = new THREE.Matrix4()
      m4.set(...translate.e)
      mario.applyMatrix4(m4)
    })

    Events.on('rotate', ({ x, y, z }) => {
      const rotate = Matrix4.fromRotate(x, y, z)
      const m4 = new THREE.Matrix4()
      m4.set(...rotate.e)
      mario.applyMatrix4(m4)
    })

    Events.on('dir', ({ x, y, z }) => {
      g.remove(dirHelper.obj)

      // render new dir
      const newDir = new Vector3(x, y, z)
      dirHelper = new RayHelper(ORIGIN, newDir)
      g.add(dirHelper.obj)

      if (Vector3.angleBetween(dir, newDir) < EPSILON) return

      // rotate
      const rotate = Matrix4.fromDirToDir(dir, newDir)
      const m4 = new THREE.Matrix4()
      m4.set(...rotate.e)
      mario.applyMatrix4(m4)

      // update dir
      dir.x = x
      dir.y = y
      dir.z = z
    })

    return g
  }
}
