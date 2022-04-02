import * as THREE from 'three'
import { Matrix4 } from '@TRE/math'
import { Coordinate } from '@TRE/playground/primitive-helpers'
import { Events } from '@TRE/core/events'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'

export default {
  description: 'Matrix transformations.',
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new Coordinate()
    g.add(c.obj)

    const light = new THREE.PointLight(0xffffff, 0.2)
    light.position.set(100, 200, 100)
    g.add(light)

    let mario: THREE.Mesh

    const objLoader = new OBJLoader()
    const mtlLoader = new MTLLoader()

    const mtlPath = 'assets/Mario/Mario.mtl'
    const objPath = 'assets/Mario/Mario.obj'

    mtlLoader.load(mtlPath, (materials) => {
      materials.preload()

      objLoader.setMaterials(materials)
      objLoader.load(objPath, (obj: any) => {
        mario = obj
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
    })

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
