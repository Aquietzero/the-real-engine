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
  allowDiagonal: boolean = true

  up: any
  left: any
  right: any
  down: any

  constructor(
    width: number, height: number,
    initial: MapSearch2DState, goal: MapSearch2DState,
  ) {
    super()
    this.width = width
    this.height = height
    this.initial = initial
    this.goal = goal

    this.setAllowDiagonal(this.allowDiagonal)
  }

  isGoal(node: MapSearch2DState): boolean {
    return node.state.equals(this.goal.state)
  }

  setBarrier(barrier: any) {
    this.barrier = barrier
  }

  setAllowDiagonal(allowDiagonal: boolean) {
    this.allowDiagonal = allowDiagonal
    this.actions = _.union([
      this.move(new Vector2(0, -1)), // up
      this.move(new Vector2(-1, 0)), // left
      this.move(new Vector2(1, 0)),  // right
      this.move(new Vector2(0, 1)),  // down
    ], this.allowDiagonal ? [
      this.move(new Vector2(-1, -1)), // up left
      this.move(new Vector2(-1, 1)), // down left
      this.move(new Vector2(1, -1)), // up right
      this.move(new Vector2(1, 1)), // down right
    ] : [])
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

  move(dir: Vector2) {
    return (node: MapSearch2DState) => {
      const newNode = new MapSearch2DState({ state: new Vector2(node.state.x, node.state.y).add(dir) })
      if (this.isOutside(newNode) || this.barrier[newNode.getId()]) return
      return newNode
    }
  }
}
