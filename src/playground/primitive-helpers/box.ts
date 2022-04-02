import * as THREE from 'three'
import { Vector3 } from '@TRE/math'
import { Point } from './point'
import { HelperConfig } from './config'

export class Box {
  obj: THREE.Group = new THREE.Group()
  center: Vector3 = new Vector3()
  radius: Vector3 = new Vector3()

  constructor(
    center: Vector3 = new Vector3(),
    radius: Vector3 = new Vector3(),
    config: HelperConfig = {}
  ) {
    const { color = 0x000000 } = config
    this.center = center
    this.radius = radius

    const m = new THREE.MeshPhongMaterial({
      color,
      wireframe: true,
    })
    const g = new THREE.BoxGeometry(2*radius.x, 2*radius.y, 2*radius.z)

    const box = new THREE.Mesh(g, m)

    const centroid = new Point(this.center, config)

    this.obj.add(centroid.obj)
    this.obj.add(box)
    this.obj.position.set(this.center.x, this.center.y, this.center.z)
  }
}
