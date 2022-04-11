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
    const {
      color = 0x000000,
      showCentroid = false,
      showFace = true,
    } = config

    this.center = center
    this.radius = radius

    const m = new THREE.MeshPhongMaterial({ color })
    const g = new THREE.BoxGeometry(
      this.radius.x * 2,
      this.radius.y * 2,
      this.radius.z * 2
    )
    const edges = new THREE.EdgesGeometry(g)
    const line = new THREE.LineSegments(edges, m)
    this.obj.add(line)

    if (showFace) {
      const m2 = new THREE.MeshPhongMaterial({
        color,
        opacity: 0.05,
        transparent: true
      })

      const box = new THREE.Mesh(g, m2)
      this.obj.add(box)
    }

    if (showCentroid) {
      const centroid = new PointHelper(ORIGIN, config)
      this.obj.add(centroid.obj)
    }

    this.obj.position.set(this.center.x, this.center.y, this.center.z)
  }
}
