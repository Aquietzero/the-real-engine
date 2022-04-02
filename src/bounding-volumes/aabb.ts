import { Vector3 } from '@TRE/math'

export class AABB {
  public center: Vector3 = new Vector3()
  public radius: Vector3 = new Vector3()

  constructor(center: Vector3 = new Vector3(), radius: Vector3 = new Vector3()) {
    this.center = center
    this.radius = radius
  }

  public static testAABBAABB(a: AABB, b: AABB): boolean {
    if (Math.abs(a.center.x - b.center.x) > (a.radius.x + b.radius.x)) return false
    if (Math.abs(a.center.y - b.center.y) > (a.radius.y + b.radius.y)) return false
    if (Math.abs(a.center.z - b.center.z) > (a.radius.z + b.radius.z)) return false
    return true
  }
}
