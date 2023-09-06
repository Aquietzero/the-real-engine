import * as _ from 'lodash'
import * as uuid from 'short-uuid'

type ID = string | number

class Transition {
  probability: number = 0
  nextState: ID
  reward: number = 0
  done: boolean = false

  constructor(
    probability: number,
    nextState: ID,
    reward: number,
    done: boolean
  ) {
    this.probability = probability
    this.nextState = nextState
    this.reward = reward
    this.done = done
  }
}

class Action {
  name: string
  transitions: Transition[]
}

class State {
  id: ID
  actions: Action[]

  getId(): string {
    return uuid.generate()
  }

  constructor(id: ID) {
    this.id = _.isNumber(id) ? id : this.getId()
  }
}

export class MDP {
  states: State[] = []

  constructor() {
    // 4x4 grid
    const N = 4
    const up = (row: number, col: number) => [row - 1 < 0 ? row : row - 1, col]
    const left = (row: number, col: number) => [
      row,
      col - 1 < 0 ? col : col - 1,
    ]
    const right = (row: number, col: number) => [
      row,
      col + 1 >= N ? col : col + 1,
    ]
    const down = (row: number, col: number) => [
      row + 1 >= N ? row : row + 1,
      col,
    ]
    const stateId = (row: number, col: number) => row * N + col
    const possibleTransitions: { [dir: string]: string[] } = {
      up: ['up', 'left', 'right'],
      left: ['left', 'up', 'down'],
      right: ['right', 'up', 'down'],
      down: ['down', 'left', 'right'],
    }
    const move = (
      row: number,
      col: number,
      actionName: any,
      actionFunctions: any
    ): Action => {
      const transitions = _.map(possibleTransitions[actionName], (dir) => {
        const [nextRow, nextCol] = actionFunctions[dir](row, col)
        const nextStateId = stateId(nextRow, nextCol)
        const isGoal = nextStateId === 15
        const isHole = _.indexOf([5, 7, 11, 12], nextStateId) > -1
        const reward = isGoal ? 1 : 0
        const probability = 1 / 3

        return new Transition(
          probability,
          nextStateId,
          reward,
          isGoal || isHole
        )
      })

      const action = new Action()
      action.name = actionName
      action.transitions = transitions
      return action
    }

    for (let row = 0; row < N; row++) {
      for (let col = 0; col < N; col++) {
        const id = stateId(row, col)
        const state = new State(id)
        const actionFunctions = { up, left, right, down }
        const actions = _.map(['up', 'right', 'down', 'left'], (actionName) => {
          return move(row, col, actionName, actionFunctions)
        })
        state.actions = actions

        this.states.push(state)
      }
    }
  }

  info() {
    _.each(this.states, (state) => {
      console.log(`state: ${state.id}`)
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

export class Policy {
  states: State[] = []
  actionMap: { [stateId: ID]: number } = {}

  constructor(states: State[]) {
    this.states = states
    // _.each(this.states, (state) => {
    //   this.actionMap[state.id] = _.random(0, state.actions.length - 1, false)
    // })
    this.actionMap = {
      0: 1,
      1: 1,
      2: 2,
      3: 3,
      4: 2,
      5: 0,
      6: 2,
      7: 0,
      8: 1,
      9: 1,
      10: 2,
      11: 0,
      12: 0,
      13: 1,
      14: 1,
      15: 0,
    }
  }

  takeAction(state: State): Action {
    if (_.indexOf([5, 7, 11, 12, 15], state.id) > -1) return

    const actionIndex = this.actionMap[state.id]
    return state.actions[actionIndex]
  }
}

export const policyEvaluation = (
  pi: Policy,
  P: MDP,
  gamma = 1.0,
  theta = 1e-10
) => {
  const initV = () => {
    const V: { [id: string]: number } = {}
    _.each(P.states, (state) => (V[state.id] = 0))
    return V
  }

  const diffV = (v1: any, v2: any): number => {
    return _.max(
      _.map(v1, (val, stateId) => {
        return Math.abs(v2[stateId] - val)
      })
    )
  }

  let prevV = initV()
  let V = initV()

  let count = 0
  while (true) {
    V = initV()
    count += 1
    _.each(P.states, (state) => {
      const action = pi.takeAction(state)
      if (!action) return
      _.each(action.transitions, (transition) => {
        const { probability, nextState, reward, done } = transition
        const doneFlag = !done ? 1 : 0
        V[state.id] +=
          probability * (reward + gamma * prevV[nextState] * doneFlag)
      })
    })

    if (diffV(V, prevV) < theta) {
      break
    }

    prevV = { ...V }
  }

  console.log('iters: ', count)
  return V
}

// const mdp = new MDP()
// mdp.info()
// const policy = new Policy(mdp.states)
// console.log(policy.actionMap)
// console.log(policyEvaluation(policy, mdp, 0.99))
