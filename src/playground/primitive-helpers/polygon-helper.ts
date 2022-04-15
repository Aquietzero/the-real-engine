import * as THREE from 'three'
import * as _ from 'lodash'
import { Point, Polygon } from '@TRE/primitive'
import { HelperConfig } from './config'

export class PolygonHelper {
  obj: THREE.Group = new THREE.Group()
  polygon: Polygon = new Polygon()

  constructor(polygon: Polygon, config: HelperConfig = {}) {
    this.polygon = polygon

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
    const [v0, v1, ...vs] = this.polygon.vertices
    let b: Point = v1
    let c: Point
    const vertices = new Float32Array(_.flatten(_.map(vs, v => {
      c = v
      const f = [
        v0.x, v0.y, v0.z,
        b.x, b.y, b.z,
        c.x, c.y, c.z,
      ]
      b = v
      return f
    })))
    g.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    const p = new THREE.Mesh(g, m2)
    this.obj.add(p)

    const edges = new THREE.EdgesGeometry(g)
    const line = new THREE.LineSegments(edges, m)
    this.obj.add(line)
  }
}
