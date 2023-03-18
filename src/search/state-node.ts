import { Action } from './action'
import * as uuid from 'short-uuid'

export class StateNode {
  id: string
  state: any
  parent: StateNode
  action: Action
  cost: number = 0

  getId(): string {
    return uuid.generate()
  }

  constructor(node: Partial<StateNode>) {
    this.state = node.state
    this.parent = node.parent
    this.action = node.action
    this.cost = node.cost || 0

    this.id = this.getId()
  }
}