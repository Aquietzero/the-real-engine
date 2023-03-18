import * as _ from 'lodash'

export class PriorityQueue<State> {
  orderBy: any
  nodes: State[] = []

  get isEmpty(): boolean {
    return this.nodes.length === 0
  }

  constructor(orderBy: any) {
    this.orderBy = orderBy
  }

  push(node: State) {
    this.nodes.push(node)
  }

  pop(): State | undefined {
    return this.nodes.pop()
  }

  shift(): State | undefined {
    return this.nodes.shift()
  }

  add(node: State) {
    this.push(node)
    this.maintain()
  }

  maintain() {
    this.nodes = _.sortBy(this.nodes, this.orderBy)
  }

  log() {
    const queue = _.map(this.nodes, 'id')
    console.log(queue.join(','))
  }
}
