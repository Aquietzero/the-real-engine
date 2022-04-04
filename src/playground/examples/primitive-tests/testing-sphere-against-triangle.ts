import * as THREE from 'three'
import * as _ from 'lodash'
import { Vector3 } from '@TRE/math'
import { PrimitiveTests } from '@TRE/primitive-tests'
import { Sphere, Triangle } from '@TRE/primitive'
import {
  CoordinateHelper, SphereHelper, TriangleHelper,
} from '@TRE/playground/primitive-helpers'


export default {
  description: 'A bunch of vectors.',
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new CoordinateHelper()
    g.add(c.obj)

    const numOfSpheres = 4
    const spheres = _.times(numOfSpheres, (n: number) => {
      const theta = Math.PI*2*n/numOfSpheres
      const s = new Sphere(new Vector3(5*Math.cos(theta), 0, 5*Math.sin(theta)), 1)
      const sHelper = new SphereHelper(s)
      g.add(sHelper.obj)
      return s
    })

    const numOfTriangles = 10
    _.times(numOfTriangles, (n: number) => {
      const theta = Math.PI*2*n/numOfTriangles
      const delta = Math.PI/(numOfTriangles + 2)
      const t = new Triangle(
        new Vector3(5*Math.cos(theta - delta), 0, 5*Math.sin(theta - delta)),
        new Vector3(5*Math.cos(theta), 1, 5*Math.sin(theta)),
        new Vector3(5*Math.cos(theta + delta), 0, 5*Math.sin(theta + delta)),
      )

      const hit = _.some(spheres, s => {
        return PrimitiveTests.testSphereTriangle(s, t)
      })
      const color = hit ? 0xff0000 : 0x000000
      const tHelper = new TriangleHelper(t, { color })
      g.add(tHelper.obj)
    })

    app.scene.add(g)
    return g
  }
}
