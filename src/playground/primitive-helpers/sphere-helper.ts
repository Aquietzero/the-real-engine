import * as _ from 'lodash'
import * as THREE from 'three'
import { ORIGIN } from '@TRE/math'
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

    const m = new THREE.MeshPhongMaterial({ color })

    const curve = new THREE.EllipseCurve(
      0, 0,
      this.sphere.radius, this.sphere.radius,
      0, 2 * Math.PI,
      false,
      0
    )
    const points = curve.getPoints(50)
    const g = new THREE.BufferGeometry().setFromPoints(points)
    const sxz = new THREE.Line(g, m)
    sxz.rotation.x = Math.PI/2
    this.obj.add(sxz)

    _.times(12, n => {
      const r = Math.PI*2*n/8
      const sv = new THREE.Line(g, m)
      sv.rotation.y = r
      this.obj.add(sv)
    })
    const centroid = new PointHelper(ORIGIN, config)

    this.obj.add(centroid.obj)
    this.obj.position.set(
      this.sphere.center.x,
      this.sphere.center.y,
      this.sphere.center.z
    )
  }
}
