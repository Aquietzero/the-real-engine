import * as _ from 'lodash'
import * as THREE from 'three'
import { Matrix4 } from '@TRE/math'
import { Events } from '@TRE/core/events'
import { Polyhedron } from '@TRE/primitive'
import { GJK } from '@TRE/primitive-tests'
import {
  CoordinateHelper, PolyhedronHelper,
} from '@TRE/playground/primitive-helpers'
import { Panel } from './panel'

export default {
  description: 'A bunch of connected vectors.',
  panel: Panel,
  run(app: any): THREE.Group {
    const g = new THREE.Group()

    const c = new CoordinateHelper()
    g.add(c.obj)

    const p0 = Polyhedron.random({ radius: 2, range: 3 })
    const p = Polyhedron.random({ radius: 2, range: 3 })

    const hit = GJK.testCollision(p0, p)
    const color = hit ? 0xff0000 : 0x0000ff

    const p0Helper = new PolyhedronHelper(p0)
    let pHelper = new PolyhedronHelper(p, { color })
    g.add(p0Helper.obj)
    g.add(pHelper.obj)

    const applyMatrix = (m4: Matrix4) => {
      p.vertices = _.map(p.vertices, v => {
        return v.applyMatrix4(m4)
      })
      _.each(p.faces, f => {
        f.a = f.a.applyMatrix4(m4)
        f.b = f.b.applyMatrix4(m4)
        f.c = f.c.applyMatrix4(m4)
      })
    }

    Events.on('translate', ({ x, y, z }) => {
      g.remove(pHelper.obj)

      const m4 = Matrix4.fromTranslate(x, y, z)
      applyMatrix(m4)

      const hit = GJK.testCollision(p0, p)
      const color = hit ? 0xff0000 : 0x0000ff

      pHelper = new PolyhedronHelper(p, { color })
      g.add(pHelper.obj)
    })

    Events.on('rotate', ({ x, y, z }) => {
      g.remove(pHelper.obj)

      const m4 = Matrix4.fromRotate(x, y, z)
      applyMatrix(m4)

      const hit = GJK.testCollision(p0, p)
      const color = hit ? 0xff0000 : 0x0000ff

      pHelper = new PolyhedronHelper(p, { color })
      g.add(pHelper.obj)
    })

    app.scene.add(g)
    return g
  }
}
