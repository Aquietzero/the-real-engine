import { Vector3 } from '@TRE/math'
import { Ray } from '@TRE/primitive/ray'
import { Hittable, HitResult } from '@TRE/ray-tracer/hittable'
import { Hittables } from '@TRE/ray-tracer/hittables'
import { XYRect, XZRect, YZRect } from '@TRE/ray-tracer/primitives'
import { Material } from '../materials'

export class Box extends Hittable {
  sides: Hittables = new Hittables()
  boxMin: Vector3 = new Vector3()
  boxMax: Vector3 = new Vector3()

  constructor(boxMin: Vector3, boxMax: Vector3) {
    super()

    this.boxMin = boxMin
    this.boxMax = boxMax

    this.sides.add([
      new XYRect(boxMin.x, boxMax.x, boxMin.y, boxMax.y, boxMin.z),
      new XYRect(boxMin.x, boxMax.x, boxMin.y, boxMax.y, boxMax.z),
      new XZRect(boxMin.x, boxMax.x, boxMin.z, boxMax.z, boxMin.y),
      new XZRect(boxMin.x, boxMax.x, boxMin.z, boxMax.z, boxMax.y),
      new YZRect(boxMin.y, boxMax.y, boxMin.z, boxMax.z, boxMin.x),
      new YZRect(boxMin.y, boxMax.y, boxMin.z, boxMax.z, boxMax.x),
    ])
  }

  hit(r: Ray, tMin: number = 0, tMax: number = Infinity): HitResult {
    return this.sides.hit(r, tMin, tMax)
  }

  setMaterial(material: Material) {
    this.sides.objects.forEach((side) => side.setMaterial(material))
  }
}
