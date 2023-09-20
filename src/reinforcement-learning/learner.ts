import * as fs from 'fs-extra'
import * as path from 'path'

import * as _ from 'lodash'
import { Environment } from './environment'
import { Policy, policyEvaluation } from './policy'
import { ID, Experience } from './types'
import {
  decaySchedule,
  logspace,
  zeros,
  full,
  empty,
  dot,
  argmax,
  argmax2,
  nArrayMap,
} from './utils'
import { SWS_MDP } from './mdps/sws'
import { MDP } from './mdp'

type Strategy = 'mc' | 'sarsa' | 'qLearning' | 'doubleQLearning'

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

interface MCLearningOpts extends LearningOpts {
  maxSteps: number
  firstVisit: boolean
}

interface SARSAOpts extends LearningOpts {}
interface QLearningOpts extends LearningOpts {}
interface DoubleQLearningOpts extends LearningOpts {}

export class Learner {
  generateTrajectory(
    selectAction: any,
    Q: any,
    epsilon: number,
    env: Environment,
    maxSteps: number = 200
  ) {
    let counter = 0
    let trajectory: Experience[] = []

    env.reset()
    let state = env.currentState

    while (true) {
      if (counter > maxSteps) break

      const actionIndex = selectAction(state, Q, epsilon)
      const { reward, nextState, done } = env.step(actionIndex)
      const experience = new Experience(
        state,
        actionIndex,
        reward,
        nextState,
        done
      )
      trajectory.push(experience)

      if (done) break
      if (counter > maxSteps) {
        // if the trajectory does not meet the fianl state, then the trajectory
        // is abandoned
        trajectory = []
        break
      }

      state = nextState
      counter += 1
    }

    return trajectory
  }

  // Monte Carlo control method.
  // alpha: learning rate
  // epsilon: exploration rate
  mc(env: Environment, opts?: MCLearningOpts) {
    const {
      gamma = 1.0,
      initAlpha = 0.5,
      minAlpha = 0.01,
      alphaDecayRatio = 0.5,
      initEpsilon = 1.0,
      minEpsilon = 0.1,
      epsilonDecayRatio = 0.9,
      nEpisodes = 3000,
      maxSteps = 200,
      firstVisit = true,
    } = opts || {}

    const nS = _.size(env.mdp.states)
    const nA = _.size(env.mdp.actionSpace)

    const discounts = logspace(0, maxSteps, maxSteps, gamma, false)
    const alphas = decaySchedule(
      initAlpha,
      minAlpha,
      alphaDecayRatio,
      nEpisodes
    )
    const epsilons = decaySchedule(
      initEpsilon,
      minEpsilon,
      epsilonDecayRatio,
      nEpisodes
    )

    const piTrack: any = []
    const Q = full([nS, nA])
    const QTrack = full([nEpisodes, nS, nA])

    const selectAction = (state: ID, Q: any, epsilon: number) => {
      if (Math.random() > epsilon) return argmax(Q[state])
      return _.sample(_.range(nA))
    }

    _.times(nEpisodes, (episode) => {
      const trajectory = this.generateTrajectory(
        selectAction,
        Q,
        epsilons[episode],
        env,
        maxSteps
      )
      const visited = full([nS, nA], false)

      _.each(trajectory, (experience, t) => {
        const { state, action } = experience
        if (visited[state][action] && firstVisit) return
        visited[state][action] = true

        const nSteps = trajectory.length - t
        const G = _.sum(
          _.map(discounts.slice(0, nSteps), (discount, i) => {
            return discount * trajectory[t + i].reward
          })
        )
        Q[state][action] += alphas[episode] * (G - Q[state][action])
      })

      QTrack[episode] = _.cloneDeep(Q)
      piTrack.push(argmax2(Q))
    })

    const V = _.map(Q, _.max)
    const pi = (state: ID) => (argmax2(Q) as any)[state]

    return { Q, V, pi, QTrack, piTrack }
  }

  // SARSA control method.
  // alpha: learning rate
  // epsilon: exploration rate
  sarsa(env: Environment, opts?: SARSAOpts) {
    const {
      gamma = 1.0,
      initAlpha = 0.5,
      minAlpha = 0.01,
      alphaDecayRatio = 0.5,
      initEpsilon = 1.0,
      minEpsilon = 0.1,
      epsilonDecayRatio = 0.9,
      nEpisodes = 3000,
    } = opts

    const nS = _.size(env.mdp.states)
    const nA = _.size(env.mdp.actionSpace)

    const piTrack: any = []
    const Q = full([nS, nA])
    const QTrack = full([nEpisodes, nS, nA])

    const alphas = decaySchedule(
      initAlpha,
      minAlpha,
      alphaDecayRatio,
      nEpisodes
    )
    const epsilons = decaySchedule(
      initEpsilon,
      minEpsilon,
      epsilonDecayRatio,
      nEpisodes
    )

    const selectAction = (state: ID, Q: any, epsilon: number) => {
      if (Math.random() > epsilon) return argmax(Q[state])
      return _.sample(_.range(nA))
    }

    _.times(nEpisodes, (episode) => {
      env.reset()
      let state = env.currentState as number
      let action = selectAction(state, Q, epsilons[episode])

      while (true) {
        const { reward, nextState, done } = <
          { reward: number; nextState: number; done: boolean }
        >env.step(action)
        const nextAction = selectAction(nextState, Q, epsilons[episode])
        const notDone = !done ? 1 : 0
        const tdTarget = reward + gamma * Q[nextState][nextAction] * notDone
        const tdError = tdTarget - Q[state][action]
        Q[state][action] += alphas[episode] * tdError

        if (done) break

        state = nextState
        action = nextAction
      }

      QTrack[episode] = _.cloneDeep(Q)
      piTrack.push(argmax2(Q))
    })

    const V = _.map(Q, _.max)
    const pi = (state: ID) => (argmax2(Q) as any)[state]

    return { Q, V, pi, QTrack, piTrack }
  }

  qLearning(env: Environment, opts?: QLearningOpts) {
    const {
      gamma = 1.0,
      initAlpha = 0.5,
      minAlpha = 0.01,
      alphaDecayRatio = 0.5,
      initEpsilon = 1.0,
      minEpsilon = 0.1,
      epsilonDecayRatio = 0.9,
      nEpisodes = 3000,
    } = opts || {}

    const nS = _.size(env.mdp.states)
    const nA = _.size(env.mdp.actionSpace)

    const piTrack: any = []
    const Q: any = full([nS, nA])
    const QTrack = full([nEpisodes, nS, nA])

    const alphas = decaySchedule(
      initAlpha,
      minAlpha,
      alphaDecayRatio,
      nEpisodes
    )
    const epsilons = decaySchedule(
      initEpsilon,
      minEpsilon,
      epsilonDecayRatio,
      nEpisodes
    )

    const selectAction = (state: ID, Q: any, epsilon: number) => {
      if (Math.random() > epsilon) return argmax(Q[state])
      return _.sample(_.range(nA))
    }

    _.times(nEpisodes, (episode) => {
      env.reset()
      let state = env.currentState as number

      while (true) {
        const action = selectAction(state, Q, epsilons[episode])
        const { reward, nextState, done } = <
          { reward: number; nextState: number; done: boolean }
        >env.step(action)
        const notDone = !done ? 1 : 0
        const tdTarget =
          reward + gamma * _.max(Q[nextState] as number[]) * notDone
        const tdError = tdTarget - Q[state][action]
        Q[state][action] += alphas[episode] * tdError

        if (done) break

        state = nextState
      }

      QTrack[episode] = _.cloneDeep(Q)
      piTrack.push(argmax2(Q))
    })

    const V = _.map(Q, _.max)
    const pi = (state: ID) => (argmax2(Q) as any)[state]

    return { Q, V, pi, QTrack, piTrack }
  }

  doubleQLearning(env: Environment, opts?: DoubleQLearningOpts) {
    const {
      gamma = 1.0,
      initAlpha = 0.5,
      minAlpha = 0.01,
      alphaDecayRatio = 0.5,
      initEpsilon = 1.0,
      minEpsilon = 0.1,
      epsilonDecayRatio = 0.9,
      nEpisodes = 3000,
    } = opts || {}

    const nS = _.size(env.mdp.states)
    const nA = _.size(env.mdp.actionSpace)

    const piTrack: any = []
    const Q1: any = full([nS, nA])
    const Q2: any = full([nS, nA])
    const Q1Track = full([nEpisodes, nS, nA])
    const Q2Track = full([nEpisodes, nS, nA])

    const alphas = decaySchedule(
      initAlpha,
      minAlpha,
      alphaDecayRatio,
      nEpisodes
    )
    const epsilons = decaySchedule(
      initEpsilon,
      minEpsilon,
      epsilonDecayRatio,
      nEpisodes
    )

    const selectAction = (state: ID, Q: any, epsilon: number) => {
      if (Math.random() > epsilon) return argmax(Q[state])
      return _.sample(_.range(nA))
    }

    const avg = (v1: number, v2: number) => (v1 + v2) / 2

    _.times(nEpisodes, (episode) => {
      env.reset()
      let state = env.currentState as number

      while (true) {
        const action = selectAction(
          state,
          nArrayMap(Q1, Q2, avg),
          epsilons[episode]
        )
        const { reward, nextState, done } = <
          { reward: number; nextState: number; done: boolean }
        >env.step(action)
        const notDone = !done ? 1 : 0

        if (Math.random() < 0.5) {
          const argmaxQ1 = argmax(Q1[nextState])
          const tdTarget = reward + gamma * Q2[nextState][argmaxQ1] * notDone
          const tdError = tdTarget - Q1[state][action]
          Q1[state][action] += alphas[episode] * tdError
        } else {
          const argmaxQ2 = argmax(Q2[nextState])
          const tdTarget = reward + gamma * Q1[nextState][argmaxQ2] * notDone
          const tdError = tdTarget - Q2[state][action]
          Q2[state][action] += alphas[episode] * tdError
        }

        if (done) break

        state = nextState
      }

      Q1Track[episode] = _.cloneDeep(Q1)
      Q2Track[episode] = _.cloneDeep(Q2)
      piTrack.push(argmax2(nArrayMap(Q1, Q2, avg)))
    })

    const Q = nArrayMap(Q1, Q2, avg)
    const V = _.map(Q, _.max)
    const pi = (state: ID) => (argmax2(Q) as any)[state]
    const QTrack = nArrayMap(Q1Track, Q2Track, avg)

    return { Q, V, pi, QTrack, piTrack }
  }

  learn(
    env: Environment,
    strategy: Strategy,
    strategyOpts: any,
    resultDir: string
  ) {
    console.log('-------------------------------')
    console.log(`${strategy} learning begins...`)
    const result = this[strategy](env, strategyOpts)

    const template = (data: string) => `export default ${data}`
    const dir = path.join(__dirname, 'result', resultDir)

    fs.ensureDirSync(dir)
    fs.writeFileSync(
      path.join(dir, `state-value-evaluation-with-${strategy}.ts`),
      template(JSON.stringify(result))
    )
    console.log(`${strategy} learning finishes...`)
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
  const strategies: Strategy[] = ['mc', 'sarsa', 'qLearning', 'doubleQLearning']
  _.each(strategies, (strategy) => {
    learner.learn(env, strategy, { gamma: 0.99 }, 'sws')
  })
  // const { Q, V, pi } = learner.mc(env, 0.99)
  // console.log(Q, V, pi)
}

run()
