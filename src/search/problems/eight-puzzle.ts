import * as _ from 'lodash'
import { Problem, StateNode, Action } from '@TRE/search'
import { Vector2 } from '@TRE/math/vector2'

// state = {
//   board: [
//     [1, 2, 3],
//     [4, *, 5],
//     [6, 7, 8],
//   ],
//   slot: Vector2(1, 1)
// }
export class EightPuzzleState extends StateNode {
  getId(): string {
    return _.flatten(this.state.board).join('')
  }

  equals(node: EightPuzzleState): boolean {
    return this.getId() === node.getId()
  }
}

export class EightPuzzle extends Problem<EightPuzzleState> {
  initial: EightPuzzleState
  goal: EightPuzzleState
  actions: Action[]
  states: EightPuzzleState[]

  size: number

  constructor(
    size: number,
    initial: EightPuzzleState, goal: EightPuzzleState,
  ) {
    super()
    this.size = size
    this.initial = initial
    this.goal = goal

    this.actions = [
      this.move(new Vector2(0, -1)), // up
      this.move(new Vector2(-1, 0)), // left
      this.move(new Vector2(1, 0)),  // right
      this.move(new Vector2(0, 1)),  // down
    ]
  }

  isGoal(node: EightPuzzleState): boolean {
    return node.equals(this.goal)
  }

  result(node: EightPuzzleState, action: Action): EightPuzzleState {
    return action(node)
  }

  actionCost(before: EightPuzzleState, action: Action, after: EightPuzzleState): number {
    return 0
  }

  isOutside(slot: Vector2): boolean {
    if (slot.x < 0 || slot.y < 0 || slot.x >= this.size || slot.y >= this.size) return true
    return false
  }

  move(dir: Vector2) {
    return (node: EightPuzzleState) => {
      const newSlot = node.state.slot.add(dir)
      if (this.isOutside(newSlot)) return
      const board = _.cloneDeep(node.state.board)
      board[node.state.slot.x][node.state.slot.y] = board[newSlot.x][newSlot.y]
      board[newSlot.x][newSlot.y] = '*'
      const newNode = new EightPuzzleState({ state: { board, slot: newSlot } })
      return newNode
    }
  }

  shuffle(n: number = 10) {
    let stateNode = this.initial
    _.times(n, () => {
      const action = _.sample(this.actions)
      const resultNode = action(stateNode)
      if (resultNode) {
        stateNode = resultNode
      }
    })

    this.initial = stateNode
  }
}
