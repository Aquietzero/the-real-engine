import * as THREE from 'three'
import { Point } from '@TRE/primitive'
import { HelperConfig } from './config'

export class PointHelper {
  obj: THREE.Group = new THREE.Group()
  point: Point = new Point()

  constructor(point: Point = new Point(), config: HelperConfig = {}) {
    const { color = 0x000000 } = config
    this.point = point

    const m = new THREE.MeshPhongMaterial({ color })
    const g = new THREE.SphereGeometry(0.1, 32, 32)

    const p = new THREE.Mesh(g, m)

    this.obj.add(p)
    this.obj.position.set(this.point.x, this.point.y, this.point.z)
  }
}
