import * as _ from 'lodash'
import { BVObject, AXIS } from '@TRE/structures/types'

class KDNode {
  left: KDNode | null
  right: KDNode | null
  axis: AXIS
  value: number

  constructor(
    left: KDNode | null,
    right: KDNode | null,
    axis: AXIS = 'x',
    value: number = 0
  ) {
    this.left = left
    this.right = right
    this.axis = axis
    this.value = value
  }
}

export class KDTree {
  public root: KDNode

  constructor(objs: BVObject[]) {
    this.root = this.construct(objs)
  }

  construct(objs: BVObject[]): KDNode {
    const axes: AXIS[] = ['x', 'y', 'z']
    const MIN_OBJECTS_PER_LEAF = 1

    const iter = (objs: BVObject[], depth: number = 0): KDNode => {
      if (!objs || objs.length === 0) return

      let axis = axes[depth % 3]
      const sortedObjsByAxis = _.sortBy(objs, obj => obj.bv.center[axis])
      const median = Math.floor(objs.length / 2)
      const value = sortedObjsByAxis[median].bv.center[axis]

      if (objs.length <= MIN_OBJECTS_PER_LEAF) {
        return new KDNode(null, null, axis, value)
      }

      const left = iter(
        sortedObjsByAxis.slice(0, median),
        depth + 1
      )
      const right = iter(
        sortedObjsByAxis.slice(median),
        depth + 1
      )

      return new KDNode(left, right, axis, value)
    }

    return iter(objs, 0)
  }

  traverse(
    visitor: any,
    contextWrapper: any = (node: KDNode, context: any) => context
  ) {
    const context = { level: 0, dir: 'root' }
    const iter = (node: KDNode, context: any = {}) => {
      if (!node) return

      visitor(node, context)
      iter(node.left, contextWrapper(node, {
        ...context,
        level: context.level + 1,
        dir: 'left',
      }))
      iter(node.right, contextWrapper(node, {
        ...context,
        level: context.level + 1,
        dir: 'right',
      }))
    }
    iter(this.root, contextWrapper(this.root, context))
  }
}
