import * as fs from 'fs-extra'
import * as path from 'path'

import * as _ from 'lodash'
import { Environment } from './environment'
import { Policy, policyEvaluation } from './policy'
import { SWS_MDP } from './mdps/sws'
import { mc, sarsa, q, doubleQ, sarsaLambda, qLambda } from './strategies'

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
  const sws = new SWS_MDP()
  console.log(sws.info())
  const env = new Environment(sws)
  const allRightPolicy = {
    1: 1,
    2: 1,
    3: 1,
    4: 1,
    5: 1,
    6: 1,
    7: 1,
  }
  const policy = new Policy(sws.states, allRightPolicy)
  const correctV = policyEvaluation(policy, sws, 0.99)
  console.log('correct V: ', correctV)

  const learner = new Learner()
  _.each(strategies, (strategy) => {
    learner.learn(env, strategy, { gamma: 0.99 }, 'sws')
  })
}

run()
