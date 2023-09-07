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
  isDone: boolean
  isGoal: boolean
  actions: Action[]

  getId(): string {
    return uuid.generate()
  }

  constructor(id: ID) {
    this.id = _.isNumber(id) ? id : this.getId()
  }
}

const isGoal = (id: number): boolean => id === 15
const isHole = (id: number): boolean => _.indexOf([5, 7, 11, 12], id) > -1

export class MDP {
  states: { [id: ID]: State } = {}
  startState: ID
  endState: ID

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
        const reward = isGoal(nextStateId) ? 1 : 0
        const probability = 1 / 3

        return new Transition(
          probability,
          nextStateId,
          reward,
          isGoal(nextStateId) || isHole(nextStateId)
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
        state.isDone = isGoal(id) || isHole(id)
        state.isGoal = isGoal(id)
        const actionFunctions = { up, left, right, down }
        const actions = _.map(['up', 'right', 'down', 'left'], (actionName) => {
          return move(row, col, actionName, actionFunctions)
        })
        state.actions = actions

        this.states[id] = state
      }
    }

    this.startState = 0
    this.endState = 15
  }

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

export class Policy {
  states: { [id: ID]: State } = {}
  actionMap: { [stateId: ID]: number } = {}

  constructor(states: { [id: ID]: State }, policy?: any) {
    this.states = states
    if (policy) {
      this.actionMap = policy
    } else {
      _.each(this.states, (state) => {
        this.actionMap[state.id] = _.random(0, state.actions.length - 1, false)
      })
    }
  }

  takeAction(state: State): Action {
    if (state.isDone) return
    const actionIndex = this.actionMap[state.id]
    return state.actions[actionIndex]
  }

  run(mdp: MDP) {
    let currentState = mdp.startState
    let reachGoal = false

    while (true) {
      const state = mdp.states[currentState]
      if (state.isDone) {
        if (state.isGoal) reachGoal = true
        break
      }

      const action = this.takeAction(state)
      const probability = Math.random()
      let cumulatedProbability = 0
      let targetTransition = _.last(action.transitions)
      for (let i = 0; i < action.transitions.length; ++i) {
        const transition = action.transitions[i]
        cumulatedProbability += transition.probability
        if (probability < cumulatedProbability) {
          targetTransition = transition
          break
        }
      }
      currentState = targetTransition.nextState
    }

    return reachGoal
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
    _.each(P.states, (state, id) => {
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

const mdp = new MDP()
mdp.info()
const policy = new Policy(mdp.states)
console.log(policyEvaluation(policy, mdp, 0.99))

let counter = 0
_.times(100, () => {
  const reachGoal = policy.run(mdp)
  if (reachGoal) counter += 1
})

console.log('reach goal #:', counter)
