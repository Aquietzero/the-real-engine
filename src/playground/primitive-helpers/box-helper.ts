import * as THREE from 'three'
import { Vector3, ORIGIN } from '@TRE/math'
import { PointHelper } from './point-helper'
import { BoxHelperConfig } from './config'

export class BoxHelper {
  obj: THREE.Group = new THREE.Group()
  center: Vector3 = new Vector3()
  radius: Vector3 = new Vector3()

  constructor(
    center: Vector3 = new Vector3(),
    radius: Vector3 = new Vector3(),
    config: BoxHelperConfig = {}
  ) {
    const { color = 0x000000, showCentroid = false } = config
    this.center = center
    this.radius = radius
    console.log(color)

    const m = new THREE.MeshPhongMaterial({ color })
    const { x: rx, y: ry, z: rz } = this.radius

    const b1 = new THREE.Vector3(-rx, -ry, -rz)
    const b2 = new THREE.Vector3(-rx, -ry, +rz)
    const b3 = new THREE.Vector3(+rx, -ry, +rz)
    const b4 = new THREE.Vector3(+rx, -ry, -rz)

    const t1 = new THREE.Vector3(-rx, ry, -rz)
    const t2 = new THREE.Vector3(-rx, ry, +rz)
    const t3 = new THREE.Vector3(+rx, ry, +rz)
    const t4 = new THREE.Vector3(+rx, ry, -rz)

    const bottomPoints = [b1, b2, b3, b4, b1]
    const topPoints = [t1, t2, t3, t4, t1]

    const bottom = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(bottomPoints), m
    )
    const top = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(topPoints), m
    )
    const v1 = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([b1, t1]), m
    )
    const v2 = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([b2, t2]), m
    )
    const v3 = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([b3, t3]), m
    )
    const v4 = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([b4, t4]), m
    )
    this.obj.add(bottom)
    this.obj.add(top)
    this.obj.add(v1)
    this.obj.add(v2)
    this.obj.add(v3)
    this.obj.add(v4)

    if (showCentroid) {
      const centroid = new PointHelper(ORIGIN, config)
      this.obj.add(centroid.obj)
    }

    this.obj.position.set(this.center.x, this.center.y, this.center.z)
  }
}
