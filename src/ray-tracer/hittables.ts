import * as _ from 'lodash'
import { Ray } from '@TRE/primitive/ray'
import { Hittable, HitResult } from '@TRE/ray-tracer/hittable'
import { BinaryBVTree, BinaryBVNode, NODE_TYPE } from '@TRE/structures/bvtree'
import { Intersection } from '@TRE/primitive-tests'

export class Hittables {
  objects: Hittable[] = []
  bvh: BinaryBVTree

  add(object: Hittable) {
    this.objects.push(object)
    // this.bvh = new BinaryBVTree(this.objects)
  }

  clear() {
    this.objects = []
  }

  hit(ray: Ray, tMin: number = 0, tMax: number = Infinity): HitResult {
    // return this.bvNodeHit(this.bvh.root, ray, tMin, tMax)
    let hitAnything = false
    let closestSoFar = tMax
    let hitRecord

    _.each(this.objects, (object) => {
      const result = object.hit(ray, tMin, closestSoFar)
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

  bvNodeHit(
    node: BinaryBVNode,
    ray: Ray,
    tMin: number,
    tMax: number
  ): HitResult {
    if (!node) return { doesHit: false }

    const { min, max } = Intersection.ofRayAndAABB(ray, node.bv)
    if (!min && !max) return { doesHit: false }

    if (node.type === NODE_TYPE.LEAF) {
      let hitAnything = false
      let closestSoFar = tMax
      let hitRecord

      _.each(node.objects, (object) => {
        const result = object.hit(ray, tMin, closestSoFar)
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

    const hitResultLeft = this.bvNodeHit(node.left, ray, tMin, tMax)
    const doesHitLeft = hitResultLeft.doesHit
    const hitResultRight = this.bvNodeHit(
      node.right,
      ray,
      tMin,
      doesHitLeft ? hitResultLeft.hitRecord.t : tMax
    )

    if (!hitResultLeft.doesHit && !hitResultRight.doesHit) {
      return { doesHit: false }
    }

    return {
      doesHit: true,
      hitRecord: hitResultRight.doesHit
        ? hitResultRight.hitRecord
        : hitResultLeft.hitRecord,
    }
  }
}
