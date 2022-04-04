import * as THREE from 'three'
import * as _ from 'lodash'
import { Vector3 } from '@TRE/math'
import { AABB } from '@TRE/bounding-volumes'
import { PrimitiveTests } from '@TRE/primitive-tests'
import { Sphere, Plane } from '@TRE/primitive'
import {
  CoordinateHelper, SphereHelper, BoxHelper,
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

    const numOfAABBs = 7
    _.times(numOfAABBs, (n: number) => {
      const theta = Math.PI*2*n/numOfAABBs
      const aabb = new AABB(
        new Vector3(5*Math.cos(theta), 0, 5*Math.sin(theta)),
        new Vector3(1, 1, 1)
      )

      const hit = _.some(spheres, s => {
        return PrimitiveTests.testSphereAABB(s, aabb)
      })
      const color = hit ? 0xff0000 : 0x000000
      const aabbHelper = new BoxHelper(aabb.center, aabb.radius, { color })
      g.add(aabbHelper.obj)
    })
    app.scene.add(g)
    return g
  }
}
