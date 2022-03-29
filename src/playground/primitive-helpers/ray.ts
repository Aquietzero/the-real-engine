import * as THREE from 'three'
import { Vector3 } from '@TRE/math'
import { Y_AXIS } from '@TRE/math'

interface RayOptions {
  color?: number
}

export class Ray {
  obj: THREE.Group = new THREE.Group()
  from: Vector3 = new Vector3()
  to: Vector3 = new Vector3()

  constructor(from: Vector3, to: Vector3, opts: RayOptions = {}) {
    this.from = from
    this.to = to

    const { color = 0x000000 } = opts

    const dir = this.to.sub(this.from)
    const len = dir.len()
    const pos = this.from.add(dir.mul(0.5))

    const m = new THREE.MeshPhongMaterial({ color })
    const g = new THREE.CylinderGeometry(0.01, 0.01, len)
    const a = new THREE.ConeGeometry(0.1, 0.2)

    const ray = new THREE.Mesh(g, m)
    const arrow = new THREE.Mesh(a, m)

    const angleToV = Vector3.angleBetween(Y_AXIS, dir)
    const n = Vector3.crossProduct(Y_AXIS, dir).normalize()

    this.obj.add(ray)
    this.obj.add(arrow)
    arrow.position.y = len/2
    this.obj.rotateOnAxis(new THREE.Vector3(n.x, n.y, n.z), angleToV)
    this.obj.position.set(pos.x, pos.y, pos.z)
  }
}
