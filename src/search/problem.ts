import * as _ from 'lodash'
import { Action } from './action'
import { StateNode } from './state-node'

export class Problem<State extends StateNode> {
  initial: State
  goal: State
  actions: Action[]
  states: State[]

  isGoal(node: State): boolean {
    return false
  }

  result(node: State, action: Action): State {
    return action(node)
  }

  actionCost(before: State, action: Action, after: State): number {
    return 0
  }

  expand(node: State): State[] {
    return _.compact(_.map(this.actions, action => {
      const resultNode = this.result(node, action)

      if (!resultNode) return

      const cost = this.actionCost(node, action, resultNode)
      resultNode.parent = node
      resultNode.action = action
      resultNode.cost = cost
      return resultNode
    }))
  }

  static getSolution(resultNode: StateNode): string[] {
    const idPath = [resultNode.getId()]
    let walker: StateNode = resultNode
    while (walker.parent) {
      walker = walker.parent
      idPath.push(walker.getId())
    }
    return _.reverse(idPath)
  }
}