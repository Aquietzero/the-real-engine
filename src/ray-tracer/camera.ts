import { Vector3 } from '@TRE/math'
import { Ray } from '@TRE/ray-tracer/ray'

const aspectRatio = 16 / 9

export class Camera {
  viewportHeight: number
  viewportWidth: number
  focalLength: number

  origin: Vector3
  horizontal: Vector3
  vertical: Vector3
  lowerLeftCorner: Vector3

  constructor() {
    this.viewportHeight = 2
    this.viewportWidth = this.viewportHeight * aspectRatio
    this.focalLength = 1

    this.origin = new Vector3(0, 0, 0)
    this.horizontal = new Vector3(this.viewportWidth, 0, 0)
    this.vertical = new Vector3(0, this.viewportHeight, 0)
    this.lowerLeftCorner = this.origin
      .sub(this.horizontal.mul(0.5))
      .sub(this.vertical.mul(0.5))
      .sub(new Vector3(0, 0, this.focalLength))
  }

  getRay(u: number, v: number): Ray {
    const dir = this.lowerLeftCorner
      .add(this.horizontal.mul(u))
      .add(this.vertical.mul(v))
      .sub(this.origin)
    return new Ray(this.origin, dir)
  }
}
