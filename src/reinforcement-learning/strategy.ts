import * as _ from 'lodash'
import { Action } from './types'
import { zeros, empty, clip, argmax } from './utils'
import { Environment } from './environment'
import { BSW_MDP } from './mdps/bsw'

type Q_VALUE = [actionId: number, value: number]

const STRATEGY: any = {
  EXPLOITATION(Q: Q_VALUE, nEpisodes?: number): number {
    return argmax(Q)
  },
  EXPLORATION(Q: Q_VALUE, nEpisodes?: number): number {
    return _.random(0, Q.length - 1, false)
  },
  EPSILON_GREEDY(epsilon: number = 0.01) {
    return (Q: Q_VALUE, nEpisodes?: number) => {
      if (Math.random() > epsilon) {
        return STRATEGY.EXPLOITATION(Q)
      } else {
        return STRATEGY.EXPLORATION(Q)
      }
    }
  },
  LINEARLY_DECAYING_EPSILON_GREEDY(
    initEpsilon: number = 1.0,
    minEpsilon: number = 0.01,
    decayRatio: number = 0.05
  ) {
    return (Q: Q_VALUE, nEpisodes?: number, episode?: number) => {
      const decayEpisodes = nEpisodes * decayRatio
      let epsilon =
        minEpsilon + (initEpsilon - minEpsilon) * (1 - episode / decayEpisodes)
      epsilon = clip(epsilon, minEpsilon, initEpsilon)
      if (Math.random() > epsilon) {
        return STRATEGY.EXPLOITATION(Q)
      } else {
        return STRATEGY.EXPLORATION(Q)
      }
    }
  },
}

export const learn = (
  env: Environment,
  nEpisodes: number = 5000,
  strategy: Function = STRATEGY.EXPLOITATION
) => {
  // Q-function and the count array
  const Q = zeros(env.actionSpace.length)
  const N = zeros(env.actionSpace.length)

  // statistics
  const Qe = empty(nEpisodes, env.actionSpace.length)
  const returns = empty(nEpisodes)
  const actions = empty(nEpisodes)

  const name = 'Pure exploitation'

  _.times(nEpisodes, (e) => {
    // each episode has only one action, so before each episode,
    // env has to be reset to the start state
    env.reset()

    const action = strategy(Q, nEpisodes, e)
    const { reward } = env.step(action)
    N[action] += 1
    Q[action] = Q[action] + (reward - Q[action]) / N[action]
    Qe[e] = Q
    returns[e] = reward
    actions[e] = action

    // console.log(Q, action)
  })

  console.log(Q)
  return { name, returns, Qe, actions }
}

const actionSpace = [new Action('left'), new Action('right')]
const env = new Environment(new BSW_MDP(), actionSpace)
learn(env, 5000, STRATEGY.LINEARLY_DECAYING_EPSILON_GREEDY())
