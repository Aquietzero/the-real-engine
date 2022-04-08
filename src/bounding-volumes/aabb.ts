import * as _ from 'lodash'
import { Vector3 } from '@TRE/math'

export class AABB {
  public center: Vector3 = new Vector3()
  public radius: Vector3 = new Vector3()

  constructor(center: Vector3 = new Vector3(), radius: Vector3 = new Vector3()) {
    this.center = center
    this.radius = radius
  }

  public static mostSeparatedPoints(vs: Vector3[]): { min: Vector3, max: Vector3 } {
    if (vs.length < 1)
      throw Error('[AABB.mostSeparatedPointsOnAABB] Should have at least 1 point.')

    let minX: Vector3 = vs[0]
    let maxX: Vector3 = vs[0]
    let minY: Vector3 = vs[0]
    let maxY: Vector3 = vs[0]
    let minZ: Vector3 = vs[0]
    let maxZ: Vector3 = vs[0]

    _.each(vs, v => {
      if (v.x < minX.x) minX = v
      else if (v.x > maxX.x) maxX = v

      if (v.y < minY.y) minY = v
      else if (v.y > maxY.y) maxY = v

      if (v.z < minZ.z) minZ = v
      else if (v.z > maxZ.z) maxZ = v
    })

    // Compute the squared distances for the three pairs of points
    const dist2x = maxX.sub(minX).len2()
    const dist2y = maxY.sub(minY).len2()
    const dist2z = maxZ.sub(minZ).len2()

    // Pick the pair (min,max) of points most distant
    // It has to be greater or equal to avoid same point
    let min = minX
    let max = maxX
    if (dist2y >= dist2x && dist2y >= dist2z) {
      max = maxY
      min = minY
    }
    if (dist2z >= dist2x && dist2z >= dist2y) {
      max = maxZ
      min = minZ
    }

    return { min, max }
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
