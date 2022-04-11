import * as THREE from 'three'
import * as _ from 'lodash'
import { Polyhedron } from '@TRE/primitive'
import { HelperConfig } from './config'

export class PolyhedronHelper {
  obj: THREE.Group = new THREE.Group()
  polyhedron: Polyhedron = new Polyhedron()

  constructor(polyhedron: Polyhedron, config: HelperConfig = {}) {
    this.polyhedron = polyhedron

    const { color = 0x000000 } = config

    const m = new THREE.MeshPhongMaterial({
      color,
    })
    const m2 = new THREE.MeshPhongMaterial({
      color,
      opacity: 0.05,
      transparent: true,
      side: THREE.DoubleSide,
    })
    const g = new THREE.BufferGeometry()
    const vertices = new Float32Array(_.flatten(_.map(polyhedron.faces, f => {
      return [
        f.a.x, f.a.y, f.a.z,
        f.b.x, f.b.y, f.b.z,
        f.c.x, f.c.y, f.c.z,
      ]
    })))
    g.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    const p = new THREE.Mesh(g, m2)
    this.obj.add(p)

    const edges = new THREE.EdgesGeometry(g)
    const line = new THREE.LineSegments(edges, m)
    this.obj.add(line)

    // this.obj.position.set(pos.x, pos.y, pos.z)
  }
}
