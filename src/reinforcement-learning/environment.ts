import { ID, Action, Transition } from './types'
import { MDP } from './mdp'

export class Environment {
  mdp: MDP
  currentState: ID
  actionSpace: Action[]

  constructor(mdp: MDP, actionSpace: Action[]) {
    this.mdp = mdp
    this.currentState = this.mdp.startState
    this.actionSpace = actionSpace
  }

  reset() {
    this.currentState = this.mdp.startState
  }

  step(actionId: number): Transition {
    const action: Action = this.mdp.states[this.currentState].actions[actionId]
    const transition: Transition = action.exec()
    this.currentState = transition.nextState
    return transition
  }
}
