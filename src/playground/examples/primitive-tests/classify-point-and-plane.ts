import * as THREE from 'three'
import * as _ from 'lodash'
import { Vector3 } from '@TRE/math'
import { GeometricalTests, POSITION } from '@TRE/primitive-tests'
import { Point, Plane } from '@TRE/primitive'
import {
  CoordinateHelper, PointHelper, PlaneHelper,
} from '@TRE/playground/primitive-helpers'

export default {
  description: 'A bunch of vectors.',
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new CoordinateHelper()
    g.add(c.obj)

    const range = 3
    const random = () => Math.floor(-range + Math.random() * 2*range)

    const plane = new Plane(new Vector3(0, 1, 0), 1)
    const planeHelper = new PlaneHelper(plane)
    g.add(planeHelper.obj)

    _.times(20, () => {
      const p = new Point(random(), random(), random())
      const position = GeometricalTests.classifyPointToPlane(p, plane)

      let color = 0x000000
      switch (position) {
        case POSITION.FRONT:
          color = 0xff0000
          break
        case POSITION.BEHIND:
          color = 0x0000ff
          break
        case POSITION.INSIDE:
          color = 0x00ff00
          break
      }

      const pHelper = new PointHelper(p, { color })
      g.add(pHelper.obj)
    })

    app.scene.add(g)
    return g
  }
}
