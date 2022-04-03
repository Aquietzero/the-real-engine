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
  }
}
