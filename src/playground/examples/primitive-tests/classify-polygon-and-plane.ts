import * as THREE from 'three'
import * as _ from 'lodash'
import { Vector3 } from '@TRE/math'
import { GeometricalTests, POSITION } from '@TRE/primitive-tests'
import { Polygon, Plane } from '@TRE/primitive'
import {
  CoordinateHelper, PolygonHelper, PlaneHelper,
} from '@TRE/playground/primitive-helpers'

export default {
  description: 'A bunch of vectors.',
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new CoordinateHelper()
    g.add(c.obj)

    const plane = new Plane(new Vector3(0.3, 1, 0), -0.5)
    const planeHelper = new PlaneHelper(plane)
    g.add(planeHelper.obj)

    _.times(10, () => {
      const polygon = Polygon.random({ radius: 1, range: 2 })
      const position = GeometricalTests.classifyPolygonToPlane(polygon, plane)

      let color = 0x000000
      switch (position) {
        case POSITION.FRONT:
          color = 0xff0000
          break
        case POSITION.BEHIND:
          color = 0x0000ff
          break
        case POSITION.STRADDLING:
          color = 0x009900
          break
      }
      const polygonHelper = new PolygonHelper(polygon, { color })
      g.add(polygonHelper.obj)
    })

    app.scene.add(g)
    return g
  }
}
