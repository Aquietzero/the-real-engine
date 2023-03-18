import * as _ from 'lodash'
import { expect } from 'chai'
import { Problem, StateNode, Action, bestFirstSearch } from '@TRE/search'
import { Vector2 } from '@TRE/math/vector2'

class MapSearch2DState extends StateNode {
  getId(): string {
    return `${this.state.x}-${this.state.y}`
  }
}

class MapSearch2D extends Problem<MapSearch2DState> {
  initial: MapSearch2DState
  goal: MapSearch2DState
  actions: Action[]
  states: MapSearch2DState[]

  width: number
  height: number

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
    return newNode
  }

  left(node: MapSearch2DState): MapSearch2DState | null {
    const newNode = new MapSearch2DState({ state: new Vector2(node.state.x - 1, node.state.y) })
    if (this.isOutside(newNode)) return
    return newNode
  }

  right(node: MapSearch2DState): MapSearch2DState | null {
    const newNode = new MapSearch2DState({ state: new Vector2(node.state.x + 1, node.state.y) })
    if (this.isOutside(newNode)) return
    return newNode
  }

  down(node: MapSearch2DState): MapSearch2DState | null {
    const newNode = new MapSearch2DState({ state: new Vector2(node.state.x, node.state.y + 1) })
    if (this.isOutside(newNode)) return
    return newNode
  }
}

describe('Search', () => {
  describe('#bestFirst', () => {
    const initial = new MapSearch2DState({ state: new Vector2(2, 2) })
    const goal = new MapSearch2DState({ state: new Vector2(4, 2) })
    const problem = new MapSearch2D(5, 5, initial, goal)
    const f = (node: StateNode): number => {
      return node.state.manhattanDistance2(goal.state)
    }
    const result = bestFirstSearch(problem, f)
    const solution = MapSearch2D.getSolution(result)
    expect(solution).to.deep.equal(['2-2', '3-2', '4-2'])
  })
})