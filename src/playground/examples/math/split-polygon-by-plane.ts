import * as THREE from 'three'
import { Vector3 } from '@TRE/math'
import { Plane, Polygon } from '@TRE/primitive'
import {
  CoordinateHelper, PlaneHelper, PolygonHelper,
} from '@TRE/playground/primitive-helpers'

export default {
  description: 'A bunch of connected vectors.',
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new CoordinateHelper()
    g.add(c.obj)

    const plane = new Plane(new Vector3(0.9, 1, 0), -0.5)
    const planeHelper = new PlaneHelper(plane)
    g.add(planeHelper.obj)

    const polygon = Polygon.random({ radius: 5, range: 1 })
    const { front, back } = polygon.splitByPlane(plane)
    const frontHelper = new PolygonHelper(front, { color: 0xff0000 })
    const backHelper = new PolygonHelper(back, { color: 0x0000ff })
    g.add(frontHelper.obj)
    g.add(backHelper.obj)

    app.scene.add(g)
    return g
  }
}
