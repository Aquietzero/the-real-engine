import * as THREE from 'three'
import { Sphere } from '@TRE/primitive'
import { PointHelper } from './point-helper'
import { HelperConfig } from './config'

export class SphereHelper {
  obj: THREE.Group = new THREE.Group()
  sphere: Sphere = new Sphere()

  constructor(
    sphere: Sphere = new Sphere(),
    config: HelperConfig = {}
  ) {
    this.sphere = sphere

    const { color = 0x000000 } = config

    const m = new THREE.MeshPhongMaterial({
      color,
      wireframe: true,
    })
    const g = new THREE.SphereGeometry(this.sphere.radius, 16, 16)

    const s = new THREE.Mesh(g, m)
    const centroid = new PointHelper(this.sphere.center, config)

    this.obj.add(centroid.obj)
    this.obj.add(s)
    this.obj.position.set(
      this.sphere.center.x,
      this.sphere.center.y,
      this.sphere.center.z
    )
  }
}
