import * as THREE from 'three'
import { Vector3 } from '@TRE/math'

export class Point {
  obj: THREE.Group = new THREE.Group()
  pos: Vector3 = new Vector3()

  constructor(pos: Vector3) {
    this.pos = pos

    const m = new THREE.MeshPhongMaterial({ color: 0x000000 })
    const g = new THREE.SphereGeometry(0.1, 32, 32)

    const point = new THREE.Mesh(g, m)

    this.obj.add(point)
  }
}
