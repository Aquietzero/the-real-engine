import * as React from 'react'
import * as _ from 'lodash'
import {
  ArrowUpOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ArrowDownOutlined
} from '@ant-design/icons'
import { MDP, Policy, policyEvaluation } from '@TRE/reinforcement-learning/policy'

const { useState, useEffect, useCallback} = React


const goGetItPolicy = {
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

const carefulPolicy = {
  0: 3,
  1: 0,
  2: 0,
  3: 0,
  4: 3,
  5: 0,
  6: 0,
  7: 0,
  8: 0,
  9: 2,
  10: 3,
  11: 0,
  12: 0,
  13: 1,
  14: 1,
  15: 0,
}

const FrozenLake: React.FC = () => {
  const gridLength = 100
  const margin = 0
  const size = 4
  const board = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
  ]

  const mdp = new MDP()
  const policy1 = new Policy(mdp.states, goGetItPolicy)
  const policy2 = new Policy(mdp.states, carefulPolicy)
  const V1 = policyEvaluation(policy1, mdp, 0.99)
  const V2 = policyEvaluation(policy2, mdp, 0.99)

  const isHole = (id: number) => {
    return _.indexOf([5, 7, 11, 12], id) > -1
  }
  const isGoal = (id: number) => {
    return id === 15
  }

  const renderBoard =(policy: any, V: any) => (
    <>
      <div
        className="relative border border-black"
        style={{
          width: size * (gridLength + margin) + 2 * margin,
          height: size * (gridLength + margin) + 2 * margin,
        }}
      >
        {_.map(board, (rowContent, row: number) => {
          return <>{_.map(board[row], (id, col: number) => {
            return (
              <div
                key={id}
                className="absolute border border-black flex justify-center items-center text-xm"
                style={{
                  top: margin,
                  left: margin,
                  transform: `translate(${col * (gridLength + margin)}px, ${row * (gridLength + margin)}px)`,
                  width: gridLength,
                  height: gridLength,
                  transition: 'transform 0.2s ease',
                }}
              >
                { isHole(id) && <div className="font-bold text-lg">Hole</div>}
                { isGoal(id) && <div className="font-bold text-lg">Goal</div>}
                { !(isHole(id) || isGoal(id)) && (
                  <div className="flex flex-col items-center text-3xl font-bold">
                    { policy.actionMap[id] === 0 && <ArrowUpOutlined />}
                    { policy.actionMap[id] === 1 && <ArrowRightOutlined />}
                    { policy.actionMap[id] === 2 && <ArrowDownOutlined />}
                    { policy.actionMap[id] === 3 && <ArrowLeftOutlined />}
                    <div className="text-sm font-normal text-gray-500 mt-2">{ V[id].toPrecision(4) }</div>
                  </div>
                )}
              </div>
            )
          })}</>
        })}
        
      </div>
    </>
  )

  return (
    <div className="flex flex-col">
      <div>
        {renderBoard(policy1, V1)}
      </div>
      <div className="mt-10">
        {renderBoard(policy2, V2)}
      </div>
    </div>
  )
}

export default {
  description: 'frozen lake.',
  notCanvas: true,
  run(app: any) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <FrozenLake />
      </div>
    )
  }
}
