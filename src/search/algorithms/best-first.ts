import * as _ from 'lodash'
import { Problem } from '../problem'
import { StateNode } from '../state-node'
import { PriorityQueue } from '../priority-queue'

export function* bestFirstSearchGenerator<State extends StateNode>(
  problem: Problem<State>, f: any
) {
  let node = problem.initial
  const frontier = new PriorityQueue<State>(f)
  frontier.push(node)
  const reached: any = {}
  reached[node.id] = true

  while (!frontier.isEmpty) {
    node = frontier.shift()
    if (problem.isGoal(node)) return node

    const children = problem.expand(node)
    for (let i = 0; i < children.length; ++i) {
      const child = children[i]
      console.log(child.getId())
      if (problem.isGoal(child)) return child
      if (!reached[child.id]) {
        frontier.add(child)
        reached[child.id] = true
      }

      yield { frontier, reached }
    }
  }
}

export function bestFirstSearch<State extends StateNode>(
  problem: Problem<State>, f: any
): StateNode {
  const gen = bestFirstSearchGenerator(problem, f)
  let result = gen.next()
  while(!result.done) {
    result = gen.next()
  }
  return result.value as (StateNode | null)
}
