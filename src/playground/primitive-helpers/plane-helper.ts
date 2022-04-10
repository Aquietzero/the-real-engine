import * as THREE from 'three'
import { ORIGIN, Y_AXIS, Vector3 } from '@TRE/math'
import { Plane } from '@TRE/primitive'
import { PointHelper } from './point-helper'
import { RayHelper } from './ray-helper'
import { PlaneHelperConfig } from './config'

export class PlaneHelper {
  obj: THREE.Group = new THREE.Group()
  plane: Plane = new Plane()

  constructor(plane: Plane = new Plane(), config: PlaneHelperConfig = {}) {
    this.plane = plane

    const { color = 0x000000, showNormal = true } = config

    const m = new THREE.MeshPhongMaterial({
      color,
      opacity: 0.05,
      transparent: true,
    })
    const m2 = new THREE.MeshPhongMaterial({
      color,
    })
    const g = new THREE.BoxGeometry(10, 0.01, 10)
    const p = new THREE.Mesh(g, m)
    this.obj.add(p)

    const p1 = new THREE.Vector3(-5, 0, -5)
    const p2 = new THREE.Vector3(-5, 0, +5)
    const p3 = new THREE.Vector3(+5, 0, +5)
    const p4 = new THREE.Vector3(+5, 0, -5)
    const points = [p1, p2, p3, p4, p1]

    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points), m2
    )
    this.obj.add(line)

    const center = this.plane.n.mul(this.plane.d/this.plane.n.len2())

    // add center point to plane
    const c = new PointHelper(ORIGIN)
    this.obj.add(c.obj)

    if (showNormal) {
      const end = ORIGIN.add(Y_AXIS.mul(plane.n.len()))
      const r = new RayHelper(ORIGIN, end)
      this.obj.add(r.obj)
    }

    // calculate plane center position
    this.obj.position.set(center.x, center.y, center.z)

    // rotate plane
    const angleToV = Vector3.angleBetween(Y_AXIS, plane.n)
    const rotateAxis = Vector3.crossProduct(Y_AXIS, plane.n).normalize()
    this.obj.rotateOnAxis(new THREE.Vector3(rotateAxis.x, rotateAxis.y, rotateAxis.z), angleToV)
  }
}
