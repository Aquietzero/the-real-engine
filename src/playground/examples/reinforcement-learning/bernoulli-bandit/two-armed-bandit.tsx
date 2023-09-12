
import * as React from 'react'
import * as echarts from 'echarts'
import * as _ from 'lodash'
import { BSW_MDP } from '@TRE/reinforcement-learning/mdps/bsw'
import d1 from '@TRE/reinforcement-learning/result/bsw_mean_episode_reward_with_epsilon_greedy'
import d2 from '@TRE/reinforcement-learning/result/bsw_mean_episode_reward_with_exploitation'
import d3 from '@TRE/reinforcement-learning/result/bsw_mean_episode_reward_with_exploration'
import d4 from '@TRE/reinforcement-learning/result/bsw_mean_episode_reward_with_linearly_decaying_epsilon_greedy'

const mdp = new BSW_MDP()
const gridLength = 80
const margin = 0

const data = {
  'epsilon_greedy': d1,
  'exploitation': d2,
  'exploration': d3,
  'linearly_decaying_epsilon_greedy': d4,
}

const TwoArmedBernoulliBandit: React.FC = () => {
  const board = [0, 1, 2]

  React.useEffect(() => {
    const chart = echarts.init(document.getElementById('plot'))
    chart.resize({ width: 1000, height: 600 })
    chart.setOption({
      legend: {
        bottom: 0,
        data: _.keys(data),
      },
      title: {
        text: 'Mean Episode Reward',
        x: 'center',
      } as any,
      xAxis: {
        type: 'value',
      },
      yAxis: { type: 'value' },
      tooltip: {
        trigger: 'axis',
      },
      series: [..._.map(data, (series, name) => ({
        type: 'line',
        name,
        tooltip: {
          valueFormatter: (value: any) => value.toFixed(2),
        },
        data: _.map(series, (y, x) => [x.toFixed(0), y]),
        symbol: 'none',
        smooth: true,
        lineStyle: {
          // color: 'black',
        }
      }))] as any
    })
  })

  const renderBoard = () => (
    <>
      <div
        className="relative border border-black"
        style={{
          width: 3 * (gridLength + margin) + 2 * margin,
          height: 1 * (gridLength + margin) + 2 * margin,
        }}
      >
        {_.map(board, (id) => {
          return (
            <div
              key={id}
              className="absolute border border-black flex justify-center items-center text-xm"
              style={{
                top: margin,
                left: margin,
                transform: `translateX(${id * (gridLength + margin)}px)`,
                width: gridLength,
                height: gridLength,
                transition: 'transform 0.2s ease',
              }}
            >
              {mdp.isHole(id) && (
                <div className="font-bold text-xl">H</div>
              )}
              {mdp.isGoal(id) && (
                <div className="font-bold text-xl">G</div>
              )}
              {id === 1 && (
                <div className="font-bold text-xl">S</div>
              )}
            </div>
          )}
        )}
      </div>
    </>
  )

  return (
    <div className="flex flex-col">
      <h2 className="mt-10">Two-Armed Bernoulli Bandit</h2>
      <div>{renderBoard()}</div>
      <div className="mt-20" id="plot" />
    </div>
  )
}

export default {
  description: 'two-armed bernoulli bandit.',
  notCanvas: true,
  run(app: any) {
    return (
      <div className="w-full h-full flex justify-center overflow-scroll">
        <TwoArmedBernoulliBandit />
      </div>
    )
  },
}
