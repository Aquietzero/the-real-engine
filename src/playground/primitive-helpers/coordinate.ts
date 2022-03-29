import * as THREE from 'three'
import { Vector3 } from '@TRE/math'
import { Ray } from './ray'
import { Point } from './point'

export class Coordinate {
  obj: THREE.Group = new THREE.Group()

  constructor() {
    const origin = new Point(new Vector3(0, 0, 0))
    const len = 10
    const xAxis = new Ray(new Vector3(-len, 0, 0), new Vector3(len, 0, 0))
    const yAxis = new Ray(new Vector3(0, -len, 0), new Vector3(0, len, 0))
    const zAxis = new Ray(new Vector3(0, 0, -len), new Vector3(0, 0, len))

    this.obj.add(xAxis.obj)
    this.obj.add(yAxis.obj)
    this.obj.add(zAxis.obj)
    this.obj.add(origin.obj)
  }
}
