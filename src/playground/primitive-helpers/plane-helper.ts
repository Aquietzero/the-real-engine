import * as THREE from 'three'
import { ORIGIN, Y_AXIS, Vector3 } from '@TRE/math'
import { Plane, Point } from '@TRE/primitive'
import { PointHelper } from './point-helper'
import { RayHelper } from './ray-helper'
import { HelperConfig } from './config'

export class PlaneHelper {
  obj: THREE.Group = new THREE.Group()
  plane: Plane = new Plane()

  constructor(plane: Plane = new Plane(), config: HelperConfig = {}) {
    this.plane = plane

    const { color = 0x000000 } = config

    const m = new THREE.MeshPhongMaterial({
      color,
      wireframe: true,
    })
    const g = new THREE.BoxGeometry(10, 0.01, 10)

    const p = new THREE.Mesh(g, m)

    this.obj.add(p)

    const center = this.plane.n.normalize().mul(this.plane.d)

    // add center point to plane
    const c = new PointHelper(ORIGIN)
    this.obj.add(c.obj)

    const end = ORIGIN.add(Y_AXIS.mul(plane.n.len()))
    const r = new RayHelper(ORIGIN, end)
    this.obj.add(r.obj)

    // calculate plane center position
    this.obj.position.set(center.x, center.y, center.z)

    // rotate plane
    const angleToV = Vector3.angleBetween(Y_AXIS, plane.n)
    const rotateAxis = Vector3.crossProduct(Y_AXIS, plane.n).normalize()
    this.obj.rotateOnAxis(new THREE.Vector3(rotateAxis.x, rotateAxis.y, rotateAxis.z), angleToV)
  }
}
