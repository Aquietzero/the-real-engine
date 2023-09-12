import * as fs from 'fs'
import * as path from 'path'
import * as cliProgress from 'cli-progress'

import * as _ from 'lodash'
import { Action } from './types'
import { zeros, empty } from './utils'
import { Environment } from './environment'
import { BSW_MDP } from './mdps/bsw'
import { STRATEGY } from './strategy'

type Strategy = {
  name: string
  run: Function
}

const strategies: Strategy[] = [
  { name: 'exploitation', run: STRATEGY.EXPLOITATION },
  { name: 'exploration', run: STRATEGY.EXPLORATION },
  { name: 'epsilon_greedy', run: STRATEGY.EPSILON_GREEDY(0.3) },
  {
    name: 'linearly_decaying_epsilon_greedy',
    run: STRATEGY.LINEARLY_DECAYING_EPSILON_GREEDY(),
  },
]

export const learn = (
  env: Environment,
  nEpisodes: number = 5000,
  strategy: Strategy = strategies[0]
) => {
  const progressBar = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  )
  progressBar.start(1, 0)

  // Q-function and the count array
  const Q = zeros(env.actionSpace.length)
  const N = zeros(env.actionSpace.length)

  // statistics
  const Qe = empty(nEpisodes, env.actionSpace.length)
  const returns = empty(nEpisodes)
  const actions = empty(nEpisodes)

  const name = 'Pure exploitation'

  let cummulatedReward = 0
  const meanEpisodeReward: number[] = []

  _.times(nEpisodes, (e) => {
    // each episode has only one action, so before each episode,
    // env has to be reset to the start state
    env.reset()

    const action = strategy.run(Q, nEpisodes, e)
    const { reward } = env.step(action)
    N[action] += 1
    Q[action] = Q[action] + (reward - Q[action]) / N[action]
    Qe[e] = Q
    returns[e] = reward
    actions[e] = action

    if (reward) {
      cummulatedReward += 1
    }
    meanEpisodeReward.push(cummulatedReward / (e + 1))

    progressBar.update((e + 1) / nEpisodes)
  })

  const template = (data: string) => `export default ${data}`
  fs.writeFileSync(
    path.join(
      __dirname,
      `./result/bsw_mean_episode_reward_with_${strategy.name}.ts`
    ),
    template(JSON.stringify(meanEpisodeReward))
  )

  progressBar.stop()

  return { name, returns, Qe, actions }
}

const actionSpace = [new Action('left'), new Action('right')]
const env = new Environment(new BSW_MDP(), actionSpace)
_.each(strategies, (strategy) => {
  console.log(`learning with ${strategy.name}`)
  learn(env, 4000, strategy)
})
