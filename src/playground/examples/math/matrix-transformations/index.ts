import * as THREE from 'three'
import { Vector3, Matrix4, ORIGIN } from '@TRE/math'
import { CoordinateHelper, BoxHelper } from '@TRE/playground/primitive-helpers'
import { Events } from '@TRE/core/events'
import { Panel } from './panel'

export default {
  description: 'Matrix transformations.',
  panel: Panel,
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new CoordinateHelper()
    g.add(c.obj)

    const box1 = new BoxHelper(
      ORIGIN, new Vector3(1, 1, 1), { color: 0xff0000 }
    )
    const box2 = new BoxHelper(
      ORIGIN, new Vector3(2, 2, 2), { color: 0x0000ff }
    )

    g.add(box1.obj)
    g.add(box2.obj)

    app.scene.add(g)

    Events.on('scale', ({ x, y, z }) => {
      const scale = Matrix4.makeFromScale(x, y, z)
      const m4 = new THREE.Matrix4()
      m4.set(...scale.e)
      box2.obj.applyMatrix4(m4)
    })

    Events.on('translate', ({ x, y, z }) => {
      const translate = Matrix4.makeFromTranslate(x, y, z)
      const m4 = new THREE.Matrix4()
      m4.set(...translate.e)
      box2.obj.applyMatrix4(m4)
    })

    Events.on('rotate', ({ x, y, z }) => {
      const rotate = Matrix4.makeFromRotate(x, y, z)
      const m4 = new THREE.Matrix4()
      m4.set(...rotate.e)
      box2.obj.applyMatrix4(m4)
    })

    return g
  }
}
