import * as _ from 'lodash'
import { Problem, StateNode, Action } from '@TRE/search'
import { Vector2 } from '@TRE/math/vector2'

export class MapSearch2DState extends StateNode {
  getId(): string {
    return `${this.state.x}-${this.state.y}`
  }
}

export class MapSearch2D extends Problem<MapSearch2DState> {
  initial: MapSearch2DState
  goal: MapSearch2DState
  actions: Action[]
  states: MapSearch2DState[]

  width: number
  height: number
  barrier: any = {}

  constructor(
    width: number, height: number,
    initial: MapSearch2DState, goal: MapSearch2DState,
  ) {
    super()
    this.width = width
    this.height = height
    this.initial = initial
    this.goal = goal
    this.actions = [
      this.up.bind(this),
      this.left.bind(this),
      this.right.bind(this),
      this.down.bind(this),
    ]
  }

  isGoal(node: MapSearch2DState): boolean {
    return node.state.equals(this.goal.state)
  }

  setBarrier(barrier: any) {
    this.barrier = barrier
  }

  result(node: MapSearch2DState, action: Action): MapSearch2DState {
    return action(node)
  }

  actionCost(before: MapSearch2DState, action: Action, after: MapSearch2DState): number {
    return before.state.manhattanDistance2(after.state)
  }

  isOutside(node: MapSearch2DState): boolean {
    const { state } = node
    if (state.x < 0 || state.y < 0 || state.x > this.width || state.y > this.height) return true
    return false
  }

  up(node: MapSearch2DState): MapSearch2DState | null {
    const newNode = new MapSearch2DState({ state: new Vector2(node.state.x, node.state.y - 1) })
    if (this.isOutside(newNode)) return
    if (this.barrier[newNode.getId()]) return
    return newNode
  }

  left(node: MapSearch2DState): MapSearch2DState | null {
    const newNode = new MapSearch2DState({ state: new Vector2(node.state.x - 1, node.state.y) })
    if (this.isOutside(newNode)) return
    if (this.barrier[newNode.getId()]) return
    return newNode
  }

  right(node: MapSearch2DState): MapSearch2DState | null {
    const newNode = new MapSearch2DState({ state: new Vector2(node.state.x + 1, node.state.y) })
    if (this.isOutside(newNode)) return
    if (this.barrier[newNode.getId()]) return
    return newNode
  }

  down(node: MapSearch2DState): MapSearch2DState | null {
    const newNode = new MapSearch2DState({ state: new Vector2(node.state.x, node.state.y + 1) })
    console.log(this.barrier, newNode.getId())
    if (this.isOutside(newNode)) return
    if (this.barrier[newNode.getId()]) return
    return newNode
  }
}
