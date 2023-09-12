import * as _ from 'lodash'
import { clip, argmax } from './utils'

type Q_VALUE = [actionId: number, value: number]

export const STRATEGY: any = {
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
