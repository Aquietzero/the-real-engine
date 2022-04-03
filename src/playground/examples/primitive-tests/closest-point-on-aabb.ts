import * as THREE from 'three'
import { Vector3 } from '@TRE/math'
import { ClosestPoint } from '@TRE/primitive-tests'
import { AABB } from '@TRE/bounding-volumes'
import { Point } from '@TRE/primitive'
import { CoordinateHelper, BoxHelper, PointHelper } from '@TRE/playground/primitive-helpers'

export default {
  description: 'A bunch of vectors.',
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new CoordinateHelper()
    g.add(c.obj)

    const aabb = new AABB(new Vector3(1, 2, 1), new Vector3(1, 2, 1))
    const boxHelper = new BoxHelper(aabb.center, aabb.radius)

    const p1 = new Point(3, 7, 3)
    const p2 = ClosestPoint.onAABBToPoint(aabb, p1)

    const p1Helper = new PointHelper(p1, { color: 0x0000ff })
    const p2Helper = new PointHelper(p2, { color: 0xff0000 })

    g.add(boxHelper.obj)
    g.add(p1Helper.obj)
    g.add(p2Helper.obj)
    app.scene.add(g)
    return g
  }
}
