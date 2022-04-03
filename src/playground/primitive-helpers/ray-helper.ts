import * as THREE from 'three'
import { Vector3 } from '@TRE/math'
import { Y_AXIS } from '@TRE/math'
import { RayHelperConfig } from './config'

export class RayHelper {
  obj: THREE.Group = new THREE.Group()
  from: Vector3 = new Vector3()
  to: Vector3 = new Vector3()

  constructor(from: Vector3, to: Vector3, config: RayHelperConfig = {}) {
    this.from = from
    this.to = to

    const { color = 0x000000, showArrow = true } = config

    const dir = this.to.sub(this.from)
    const len = dir.len()
    const pos = this.from.add(dir.mul(0.5))

    const m = new THREE.MeshPhongMaterial({ color })
    const g = new THREE.CylinderGeometry(0.01, 0.01, len)
    const a = new THREE.ConeGeometry(0.1, 0.2)

    const angleToV = Vector3.angleBetween(Y_AXIS, dir)
    const n = Vector3.crossProduct(Y_AXIS, dir).normalize()

    const ray = new THREE.Mesh(g, m)
    this.obj.add(ray)

    if (showArrow) {
      const arrow = new THREE.Mesh(a, m)
      arrow.position.y = len/2
      this.obj.add(arrow)
    }

    this.obj.rotateOnAxis(new THREE.Vector3(n.x, n.y, n.z), angleToV)
    this.obj.position.set(pos.x, pos.y, pos.z)
  }
}
