import * as _ from 'lodash'
import { Ray } from '@TRE/primitive/ray'
import { Hittable, HitResult } from '@TRE/ray-tracer/hittable'
import { BinaryBVTree } from '@TRE/structures/bvtree'

export class Hittables {
  objects: Hittable[] = []
  bvh: BinaryBVTree

  add(object: Hittable) {
    this.objects.push(object)
    this.bvh = new BinaryBVTree(this.objects)
  }

  clear() {
    this.objects = []
  }

  hit(r: Ray, tMin: number = 0, tMax: number = Infinity): HitResult {
    let hitAnything = false
    let closestSoFar = tMax
    let hitRecord

    _.each(this.objects, (object) => {
      const result = object.hit(r, tMin, closestSoFar)
      if (result.doesHit) {
        hitAnything = true
        closestSoFar = result.hitRecord.t
        hitRecord = result.hitRecord
      }
    })

    return {
      doesHit: hitAnything,
      hitRecord,
    }
  }
}
