import * as _ from 'lodash'
import { Vector3 } from '@TRE/math'
import { AABB } from '@TRE/bounding-volumes'
import { BVObject } from '@TRE/structures/types'

enum NODE_TYPE {
  NODE = 'NODE',
  LEAF = 'LEAF',
}

class BVNode {
  type: NODE_TYPE
  bv: any
  parent: BVNode | null
  objects: any[]
}

class BinaryBVNode extends BVNode {
  left: BinaryBVNode
  right: BinaryBVNode
}

export class BinaryBVTree {
  public root: BinaryBVNode = new BinaryBVNode()

  constructor(objs: BVObject[]) {
    this.root = this.construct(objs)
  }

  construct(objs: BVObject[]): BinaryBVNode {
    if (objs.length <= 0)
      throw Error('[BinaryBVTree.construct]: should have at least 1 object.')

    const MIN_OBJECTS_PER_LEAF = 1
    const p = new BinaryBVNode()
    p.bv = this.computeBoundingVolume(objs)

    if (objs.length <= MIN_OBJECTS_PER_LEAF) {
      p.type = NODE_TYPE.LEAF
      p.objects = objs
    } else {
      p.type = NODE_TYPE.NODE
      const { left, right } = this.partitionObjects(objs)

      if (left.length) {
        if (left.length !== objs.length) {
          p.left = this.construct(left)
        } else {
          const leftNode = new BinaryBVNode()
          leftNode.bv = this.computeBoundingVolume(objs)
          leftNode.type = NODE_TYPE.LEAF
          p.left = leftNode
        }
      }
      if (right.length) {
        if (right.length !== objs.length) {
          p.right = this.construct(right)
        } else {
          const rightNode = new BinaryBVNode()
          rightNode.bv = this.computeBoundingVolume(objs)
          rightNode.type = NODE_TYPE.LEAF
          p.right = rightNode
        }
      }
    }

    return p
  }

  computeBoundingVolume(objs: BVObject[]): AABB {
    let minX = Infinity
    let minY = Infinity
    let minZ = Infinity
    let maxX = -Infinity
    let maxY = -Infinity
    let maxZ = -Infinity

    _.each(objs, obj => {
      const minV = obj.bv.center.sub(obj.bv.radius)
      const maxV = obj.bv.center.add(obj.bv.radius)

      if (minV.x < minX) minX = minV.x
      if (minV.y < minY) minY = minV.y
      if (minV.z < minZ) minZ = minV.z
      if (maxV.x > maxX) maxX = maxV.x
      if (maxV.y > maxY) maxY = maxV.y
      if (maxV.z > maxZ) maxZ = maxV.z
    })

    const min = new Vector3(minX, minY, minZ)
    const max = new Vector3(maxX, maxY, maxZ)

    return new AABB(min.add(max).mul(0.5), max.sub(min).mul(0.5))
  }

  partitionObjects(objs: BVObject[]): { left: BVObject[], right: BVObject[] } {
    const centers = _.map(objs, 'bv.center')
    const { min, max } = AABB.mostSeparatedPoints(centers)

    const separatingAxis = max.sub(min)

    // if the separating axis is an zero vector, then further partition
    // is impossible.
    if (separatingAxis.isZero()) {
      return { left: objs, right: [] }
    }
    const len = separatingAxis.len()
    const mid = len / 2
    const left: BVObject[] = []
    const right: BVObject[] = []

    _.each(objs, obj => {
      const proj = Vector3.dotProduct(obj.bv.center.sub(min), separatingAxis) / len
      proj < mid ? left.push(obj) : right.push(obj)
    })

    return { left, right }
  }

  traverse(visitor: any) {
    const context = { level: 0 }
    const iter = (node: BinaryBVNode, context: any = {}) => {
      if (!node) return

      visitor(node, context)
      iter(node.left, { ...context, level: context.level + 1})
      iter(node.right, { ...context, level: context.level + 1})
    }
    iter(this.root, context)
  }

  height(): number {
    const iter = (node: BinaryBVNode): number => {
      if (!node) return 0
      return 1 + Math.max(iter(node.left), iter(node.right))
    }
    return iter(this.root)
  }
}
