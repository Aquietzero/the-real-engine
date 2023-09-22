import * as fs from 'fs-extra'
import * as path from 'path'

import * as _ from 'lodash'
import { Environment } from './environment'
import { Policy, policyIteration } from './policy'
import { SWS_MDP } from './mdps/sws'
import { FL_MDP } from './mdps/fl'
import {
  mc,
  sarsa,
  q,
  doubleQ,
  sarsaLambda,
  qLambda,
  dynaQ,
  trajectorySampling,
} from './strategies'

const strategies = [
  {
    name: 'mc',
    exec: mc,
  },
  {
    name: 'sarsa',
    exec: sarsa,
  },
  {
    name: 'q',
    exec: q,
  },
  {
    name: 'double-q',
    exec: doubleQ,
  },
  {
    name: 'sarsa-lambda',
    exec: sarsaLambda,
  },
  {
    name: 'q-lambda',
    exec: qLambda,
  },
  {
    name: 'dyna-q',
    exec: dynaQ,
  },
  {
    name: 'trajectory-sampling',
    exec: trajectorySampling,
  },
]

interface LearningOpts {
  gamma: number
  initAlpha: number
  minAlpha: number
  alphaDecayRatio: number
  initEpsilon: number
  minEpsilon: number
  epsilonDecayRatio: number
  nEpisodes: number
}

export class Learner {
  learn(env: Environment, strategy: any, strategyOpts: any, resultDir: string) {
    console.log('-------------------------------')
    console.log(`${strategy.name} learning begins...`)
    const result = strategy.exec(env, strategyOpts)

    const template = (data: string) => `export default ${data}`
    const dir = path.join(__dirname, 'result', resultDir)

    fs.ensureDirSync(dir)
    fs.writeFileSync(
      path.join(dir, `state-value-evaluation-with-${strategy.name}.ts`),
      template(JSON.stringify(result))
    )
    console.log(`${strategy.name} learning finishes...`)
  }
}

const run = () => {
  // const mdp = new SWS_MDP()
  const mdp = new FL_MDP(4, [5, 7, 11, 12])
  console.log(mdp.info())
  const env = new Environment(mdp)
  const correctV = policyIteration(mdp, 0.99)
  console.log('correct V: ', correctV)

  const learner = new Learner()
  _.each(strategies, (strategy) => {
    learner.learn(env, strategy, { gamma: 0.99, nEpisodes: 10000 }, 'fl')
  })
}

run()
