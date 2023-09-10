import * as _ from 'lodash'
import { ID, State, Transition, Action } from './types'

export class MDP {
  states: { [id: ID]: State } = {}
  startState: ID = -1
  endState: ID = -1

  info() {
    _.each(this.states, (state, id) => {
      console.log(`state: ${id}`)
      _.each(state.actions, (action) => {
        console.log(`  action: ${action.name}`)
        _.each(action.transitions, (transition, index) => {
          const { probability, nextState, reward, done } = transition
          console.log(
            `    transition_${index}: \t${probability.toPrecision(
              2
            )}% \t${nextState} \t${reward} \t${done}`
          )
        })
      })
    })
  }
}
