import { Vector3 } from '@TRE/math'
import { Ray } from '@TRE/primitive/ray'

interface CameraOptions {
  fov?: number
  aspectRatio?: number
  aperture?: number
  focusDistance?: number
}

export class Camera {
  viewportHeight: number
  viewportWidth: number
  focalLength: number
  lensRadius: number
  aperture: number
  focusDistance: number

  u: Vector3
  v: Vector3
  w: Vector3

  origin: Vector3
  horizontal: Vector3
  vertical: Vector3
  lowerLeftCorner: Vector3

  constructor(options: CameraOptions) {
    const fov = options.fov || 20
    const aspectRatio = options.aspectRatio || 16 / 9

    this.aperture = options.aperture || 0.1
    this.focusDistance = options.focusDistance
    this.lensRadius = this.aperture / 2

    const theta = (fov / 180) * Math.PI
    const h = Math.tan(theta / 2)

    this.viewportHeight = 2 * h
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

  getRay(s: number, t: number): Ray {
    const rd = Vector3.randomInUnitDisk().mul(this.lensRadius)
    const offset = this.u.mul(rd.x).add(this.v.mul(rd.y))
    const dir = this.lowerLeftCorner
      .add(this.horizontal.mul(s))
      .add(this.vertical.mul(t))
      .sub(this.origin)
      .sub(offset)

    return new Ray(this.origin.add(offset), dir)
  }

  look(from: Vector3, to: Vector3, up: Vector3) {
    this.w = from.sub(to).normalize()
    this.u = Vector3.crossProduct(up, this.w).normalize()
    this.v = Vector3.crossProduct(this.w, this.u)

    this.focusDistance = from.sub(to).len()

    this.origin = from
    this.horizontal = this.u.mul(this.viewportWidth * this.focusDistance)
    this.vertical = this.v.mul(this.viewportHeight * this.focusDistance)
    this.lowerLeftCorner = this.origin
      .sub(this.horizontal.div(2))
      .sub(this.vertical.div(2))
      .sub(this.w.mul(this.focusDistance))
  }
}
