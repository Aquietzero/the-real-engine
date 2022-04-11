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
    // const m2 = new THREE.MeshPhongMaterial({
    //   color,
    //   opacity: 0.05,
    //   transparent: true,
    // })
    // const g = new THREE.SphereGeometry(this.sphere.radius)
    // const s = new THREE.Mesh(g, m2)
    // this.obj.add(s)
    const step = Math.PI/2/4
    _.each([-3.5*step, -2*step, -step, 0, step, 2*step, 3.5*step], theta => {
      const cos = Math.cos(theta)
      const sin = Math.sin(theta)
      const c = new THREE.EllipseCurve(
        0, 0,
        cos*this.sphere.radius, cos*this.sphere.radius,
        0, 2 * Math.PI,
        false,
        0
      )
      const points = c.getPoints(50)
      const circle = new THREE.BufferGeometry().setFromPoints(points)
      const sxz = new THREE.Line(circle, m)
      sxz.rotation.x = Math.PI/2
      sxz.position.y = sin*this.sphere.radius
      this.obj.add(sxz)
    })

    const c0 = new THREE.EllipseCurve(
      0, 0,
      this.sphere.radius, this.sphere.radius,
      0, 2 * Math.PI,
      false,
      0
    )
    const points = c0.getPoints(50)
    const circle = new THREE.BufferGeometry().setFromPoints(points)
    _.times(12, n => {
      const r = Math.PI*2*n/8
      const sv = new THREE.Line(circle, m)
      sv.rotation.y = r
      this.obj.add(sv)
    })
    // const g = new THREE.SphereGeometry(
    //   this.sphere.radius
    // )
    // const edges = new THREE.EdgesGeometry(g)
    // const line = new THREE.LineSegments(edges, m)
    // this.obj.add(line)
    const centroid = new PointHelper(ORIGIN, config)

    this.obj.add(centroid.obj)
    this.obj.position.set(
      this.sphere.center.x,
      this.sphere.center.y,
      this.sphere.center.z
    )
  }
}
