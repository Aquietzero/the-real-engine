import * as THREE from 'three'
import { Plane, Point } from '@TRE/primitive'
import { HelperConfig } from './config'

export class PlaneHelper {
  obj: THREE.Group = new THREE.Group()
  plane: Plane = new Plane()

  constructor(plane: Plane = new Plane(), config: HelperConfig = {}) {
    this.plane = plane

    const { color = 0x000000 } = config

    const m = new THREE.MeshPhongMaterial({ color })
    const g = new THREE.BoxGeometry(20, 0.1, 20)

    const point = new THREE.Mesh(g, m)

    this.obj.add(point)
    // this.obj.position.set(this.pos.x, this.pos.y, this.pos.z)
  }
}
