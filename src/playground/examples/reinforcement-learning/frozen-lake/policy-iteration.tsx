import * as React from 'react'
import * as _ from 'lodash'
import {
  ArrowUpOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons'
import {
  MDP,
  policyEvaluation,
  policyIterationGenerator,
} from '@TRE/reinforcement-learning/policy'

const FrozenLakePolicyIteration: React.FC = () => {
  const mdp = new MDP()
  const [gen, setGen] = React.useState<any>()
  const [ctx, setCtx] = React.useState<any>()
  const [isDone, setIsDone] = React.useState(false)
  const gridLength = 100
  const margin = 0
  const size = 4
  const board = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
  ]

  React.useLayoutEffect(() => {
    const gen = policyIterationGenerator(mdp, 0.99)
    const next = gen.next()
    setGen(gen)
    setCtx(next.value)
  }, [])

  const optimize = () => {
    if (isDone) return

    const next = gen.next()
    console.log(next)
    if (next.done) setIsDone(true)
    setCtx(next.value)
  }

  const evaluate = () => {
    const V = policyEvaluation(ctx.policy, mdp)
    console.log(V, ctx.policy)
    setCtx({ policy: ctx.policy, V })
  }

  const isHole = (id: number) => {
    return _.indexOf([5, 7, 11, 12], id) > -1
  }
  const isGoal = (id: number) => {
    return id === 15
  }

  const renderBoard = (policy: any, V: any) => (
    <>
      <div
        className="relative border border-black"
        style={{
          width: size * (gridLength + margin) + 2 * margin,
          height: size * (gridLength + margin) + 2 * margin,
        }}
      >
        {_.map(board, (rowContent, row: number) => {
          return (
            <>
              {_.map(board[row], (id, col: number) => {
                return (
                  <div
                    key={id}
                    className="absolute border border-black flex justify-center items-center text-xm"
                    style={{
                      top: margin,
                      left: margin,
                      transform: `translate(${col * (gridLength + margin)}px, ${
                        row * (gridLength + margin)
                      }px)`,
                      width: gridLength,
                      height: gridLength,
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    {isHole(id) && (
                      <div className="font-bold text-lg">Hole</div>
                    )}
                    {isGoal(id) && (
                      <div className="font-bold text-lg">Goal</div>
                    )}
                    {!(isHole(id) || isGoal(id)) && (
                      <div className="flex flex-col items-center text-3xl font-bold">
                        {policy.actionMap[id] === 0 && <ArrowUpOutlined />}
                        {policy.actionMap[id] === 1 && <ArrowRightOutlined />}
                        {policy.actionMap[id] === 2 && <ArrowDownOutlined />}
                        {policy.actionMap[id] === 3 && <ArrowLeftOutlined />}
                        <div className="text-sm font-normal text-gray-500 mt-2">
                          {V[id].toPrecision(4)}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </>
          )
        })}
      </div>
    </>
  )

  return (
    <div className="flex flex-col">
      <h2 className="mt-10">Optimal Policy</h2>
      <div>{ctx && renderBoard(ctx.policy, ctx.V)}</div>
      <div onClick={e => optimize()}>optimize</div>
      <div onClick={e => evaluate()}>evaluate</div>
      <div>{ isDone ? 'done' : '...' }</div>
    </div>
  )
}

export default {
  description: 'frozen lake policy iteration.',
  notCanvas: true,
  run(app: any) {
    return (
      <div className="w-full h-full flex justify-center overflow-scroll">
        <FrozenLakePolicyIteration />
      </div>
    )
  },
}
