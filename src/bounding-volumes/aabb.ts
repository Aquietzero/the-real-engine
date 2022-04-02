import * as _ from 'lodash'
import { Vector3 } from '@TRE/math'

export class AABB {
  public center: Vector3 = new Vector3()
  public radius: Vector3 = new Vector3()

  constructor(center: Vector3 = new Vector3(), radius: Vector3 = new Vector3()) {
    this.center = center
    this.radius = radius
  }

  public static calculateAABB(vs: Vector3[]): AABB {
    if (vs.length < 1)
      throw Error('[AABB.calculateAABB] Should have at least 1 point.')

    let minX: number = vs[0].x
    let maxX: number = vs[0].x
    let minY: number = vs[0].y
    let maxY: number = vs[0].y
    let minZ: number = vs[0].z
    let maxZ: number = vs[0].z

    _.each(vs, v => {
      if (v.x < minX) minX = v.x
      else if (v.x > maxX) maxX = v.x

      if (v.y < minY) minY = v.y
      else if (v.y > maxY) maxY = v.y

      if (v.z < minZ) minZ = v.z
      else if (v.z > maxZ) maxZ = v.z
    })

    const radius = new Vector3(
      (maxX - minX) / 2,
      (maxY - minY) / 2,
      (maxZ - minZ) / 2
    )
    const center = new Vector3(
      minX + radius.x,
      minY + radius.y,
      minZ + radius.z,
    )

    return new AABB(center, radius)
  }

  public static testAABBAABB(a: AABB, b: AABB): boolean {
    if (Math.abs(a.center.x - b.center.x) > (a.radius.x + b.radius.x)) return false
    if (Math.abs(a.center.y - b.center.y) > (a.radius.y + b.radius.y)) return false
    if (Math.abs(a.center.z - b.center.z) > (a.radius.z + b.radius.z)) return false
    return true
  }
}
