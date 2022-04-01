import * as THREE from 'three'
import { Matrix4 } from '@TRE/math'
import { Coordinate } from '@TRE/playground/primitive-helpers'
import { Events } from '@TRE/core/events'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

export default {
  description: 'Matrix transformations.',
  run(app: any): THREE.Group {
    const loader = new OBJLoader()
    const g = new THREE.Group()

    const c = new Coordinate()
    g.add(c.obj)

    const l1 = new THREE.PointLight(0xffffff, 0.5)
    l1.position.set(50, 100, 50)
    const l2 = new THREE.PointLight(0xffffff, 0.5)
    l2.position.set(-50, 100, 50)
    app.scene.add(l1)
    app.scene.add(l2)

    let mario: THREE.Mesh

    loader.load(
      'assets/Mario.obj',
      (object: any) => {
        console.log(object.children[0])
        const mesh = object.children[0]
        const red = new THREE.MeshPhongMaterial({
          color: 0x999999,
        })
        mario = new THREE.Mesh(mesh.geometry, red)
        const m4 = new THREE.Matrix4()
        const s = 0.05
        m4.set(
          s, 0, 0, 0,
          0, s, 0, 0,
          0, 0, s, 0,
          0, 0, 0, 1
        )
        mario.applyMatrix4(m4)
        g.add(mario)
      }
    )

    app.scene.add(g)

    Events.on('scale', ({ x, y, z }) => {
      const scale = Matrix4.makeFromScale(x, y, z)
      const m4 = new THREE.Matrix4()
      m4.set(...scale.e)
      mario.applyMatrix4(m4)
    })

    Events.on('translate', ({ x, y, z }) => {
      const translate = Matrix4.makeFromTranslate(x, y, z)
      const m4 = new THREE.Matrix4()
      m4.set(...translate.e)
      mario.applyMatrix4(m4)
    })

    Events.on('rotate', ({ x, y, z }) => {
      const rotate = Matrix4.makeFromRotate(x, y, z)
      const m4 = new THREE.Matrix4()
      m4.set(...rotate.e)
      mario.applyMatrix4(m4)
    })

    return g
  }
}
