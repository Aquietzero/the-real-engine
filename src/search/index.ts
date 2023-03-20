export * from './action'
export * from './problem'
export * from './state-node'
export * from './priority-queue'

import { bestFirstSearch, bestFirstSearchGenerator } from './algorithms/best-first'

export const SearchAlgorithms = {
  bestFirstSearch,
  bestFirstSearchGenerator,
}