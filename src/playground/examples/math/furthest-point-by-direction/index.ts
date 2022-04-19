import * as THREE from 'three'
import { Events } from '@TRE/core/events'
import { Vector3, ORIGIN, EPSILON } from '@TRE/math'
import { Point, Polyhedron } from '@TRE/primitive'
import { Panel } from './panel'
import {
  CoordinateHelper, PolyhedronHelper, RayHelper, PointHelper,
} from '@TRE/playground/primitive-helpers'

export default {
  description: 'A bunch of connected vectors.',
  panel: Panel,
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new CoordinateHelper()
    g.add(c.obj)

    let dir: Vector3 = new Vector3(0, 0, 5)
    let dirHelper = new RayHelper(ORIGIN, dir, { color: 0xff0000 })
    g.add(dirHelper.obj)

    const p = Polyhedron.random({ radius: 2, range: 2 })
    const pHelper = new PolyhedronHelper(p)
    g.add(pHelper.obj)

    let sp: Point = p.supportPoint(dir)
    let spHelper = new PointHelper(sp, { color: 0xff0000 })
    g.add(spHelper.obj)

    Events.on('dir', ({ x, y, z }) => {
      g.remove(spHelper.obj)
      g.remove(dirHelper.obj)

      // render new dir
      const newDir = new Vector3(x, y, z)
      dirHelper = new RayHelper(ORIGIN, newDir, { color: 0xff0000 })
      g.add(dirHelper.obj)

      // support point
      sp = p.supportPoint(newDir)
      spHelper = new PointHelper(sp, { color: 0xff0000 })
      g.add(spHelper.obj)

      if (Vector3.angleBetween(dir, newDir) < EPSILON) return

      // update dir
      dir.x = x
      dir.y = y
      dir.z = z
    })

    app.scene.add(g)
    return g
  }
}
