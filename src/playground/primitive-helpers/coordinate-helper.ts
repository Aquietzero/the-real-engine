import * as THREE from 'three'
import { Point } from '@TRE/primitive'
import { RayHelper } from './ray-helper'
import { PointHelper } from './point-helper'

export class CoordinateHelper {
  obj: THREE.Group = new THREE.Group()

  constructor() {
    const origin = new PointHelper(new Point(0, 0, 0))
    const len = 10
    const xAxis = new RayHelper(new Point(-len, 0, 0), new Point(len, 0, 0))
    const yAxis = new RayHelper(new Point(0, -len, 0), new Point(0, len, 0))
    const zAxis = new RayHelper(new Point(0, 0, -len), new Point(0, 0, len))

    this.obj.add(xAxis.obj)
    this.obj.add(yAxis.obj)
    this.obj.add(zAxis.obj)
    this.obj.add(origin.obj)
  }
}
