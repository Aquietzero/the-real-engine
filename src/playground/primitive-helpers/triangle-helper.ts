import * as THREE from 'three'
import { Triangle } from '@TRE/primitive'
import { PointHelper } from './point-helper'
import { RayHelper } from './ray-helper'
import { HelperConfig } from './config'

export class TriangleHelper {
  obj: THREE.Group = new THREE.Group()
  triangle: Triangle = new Triangle()

  constructor(
    triangle: Triangle = new Triangle(),
    config: HelperConfig = {}
  ) {
    this.triangle = triangle

    const { color = 0x000000 } = config

    const { a, b, c } = this.triangle
    const ab = new RayHelper(a, b, { color, showArrow: false })
    const ac = new RayHelper(a, c, { color, showArrow: false })
    const bc = new RayHelper(b, c, { color, showArrow: false })

    const pa = new PointHelper(a, { color })
    const pb = new PointHelper(b, { color })
    const pc = new PointHelper(c, { color })

    this.obj.add(pa.obj)
    this.obj.add(pb.obj)
    this.obj.add(pc.obj)
    this.obj.add(ab.obj)
    this.obj.add(ac.obj)
    this.obj.add(bc.obj)

    const g = new THREE.BufferGeometry()
    const vertices = new Float32Array([
      a.x, a.y, a.z,
      b.x, b.y, b.z,
      c.x, c.y, c.z,
    ])
    g.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    const m2 = new THREE.MeshPhongMaterial({
      color,
      opacity: 0.05,
      transparent: true,
      side: THREE.DoubleSide,
    })
    const t = new THREE.Mesh(g, m2)
    this.obj.add(t)
  }
}
