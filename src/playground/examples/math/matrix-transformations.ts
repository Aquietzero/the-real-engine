import * as THREE from 'three'
import { Matrix4 } from '@TRE/math'
import { Coordinate, Ray } from '@TRE/playground/primitive-helpers'

export default {
  description: 'Matrix transformations.',
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new Coordinate()
    g.add(c.obj)

    const red = new THREE.MeshPhongMaterial({ color: 0xff0000 })
    const blue = new THREE.MeshPhongMaterial({ color: 0x0000ff })
    const geometry = new THREE.BoxGeometry(2, 2, 2)
    const wireframe1 = new THREE.WireframeGeometry(geometry)
    const wireframe2 = new THREE.WireframeGeometry(geometry)
    const box1 = new THREE.LineSegments(wireframe1, red)
    const box2 = new THREE.LineSegments(wireframe2, blue)

    const s2 = Matrix4.makeFromScale(2, 2, 2)
    const m4 = new THREE.Matrix4()
    m4.set(...s2.e)
    box2.applyMatrix4(m4)


    g.add(box1)
    g.add(box2)

    app.scene.add(g)
    return g
  }
}
