
import * as React from 'react'
import * as echarts from 'echarts'
import * as _ from 'lodash'
import { BSW_MDP } from '@TRE/reinforcement-learning/mdps/bsw'
import d1 from '@TRE/reinforcement-learning/result/bsw/mean_episode_reward_with_exploitation'
import d2 from '@TRE/reinforcement-learning/result/bsw/mean_episode_reward_with_exploration'
import d3 from '@TRE/reinforcement-learning/result/bsw/mean_episode_reward_with_epsilon_greedy'
import d4 from '@TRE/reinforcement-learning/result/bsw/mean_episode_reward_with_linearly_decaying_epsilon_greedy'
import d5 from '@TRE/reinforcement-learning/result/bsw/mean_episode_reward_with_exp_decaying_epsilon_greedy'
import d6 from '@TRE/reinforcement-learning/result/bsw/mean_episode_reward_with_optimistic_initialization'
import d7 from '@TRE/reinforcement-learning/result/bsw/mean_episode_reward_with_softmax'
import d8 from '@TRE/reinforcement-learning/result/bsw/mean_episode_reward_with_upper_confidence_bound'
import d9 from '@TRE/reinforcement-learning/result/bsw/mean_episode_reward_with_thompson_sampling'

const mdp = new BSW_MDP()
const gridLength = 80
const margin = 0

const data = {
  'exploitation': d1,
  'exploration': d2,
  'epsilon_greedy': d3,
  'linearly_decaying_epsilon_greedy': d4,
  'exp_decaying_epsilon_greedy': d5,
  'optimistic_initialization': d6,
  'softmax': d7,
  'upper_confidence_bound': d8,
  'thompson_sampling': d9,
}

const TwoArmedBernoulliBandit: React.FC = () => {
  const board = [0, 1, 2]

  React.useEffect(() => {
    const chart1 = echarts.init(document.getElementById('mean-episode-reward'))
    const chart2 = echarts.init(document.getElementById('zoom-on-best'))

    chart1.resize({ width: 1200, height: 400 })
    chart2.resize({ width: 1200, height: 400 })

    chart1.setOption({
      grid: {
        right: '20%'
      },
      legend: {
        orient: 'vertical',
        top: 'center',
        right: 0,
        data: _.keys(data),
      },
      title: {
        text: 'Mean Episode Reward',
        x: 'center',
      } as any,
      xAxis: {
        type: 'value',
        min: 30,
      } as any,
      yAxis: { type: 'value' },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          label: {
            formatter: (params: any) => `episode: ${params.value}`
          }
        }
      },
      // dataZoom: [
      //   { show: true, xAxisIndex: [0], realtime: true },
      //   { type: 'inside', xAxisIndex: [0], realtime: true },
      // ],
      series: [..._.map(data, (series, name) => ({
        type: 'line',
        name,
        tooltip: {
          valueFormatter: (value: any) => value.toFixed(6),
        },
        data: _.map(series, (y, x) => [x.toFixed(0), y]),
        symbol: 'none',
        smooth: true,
        lineStyle: {
          // color: 'black',
        }
      }))] as any
    })
    chart2.setOption({
      grid: {
        right: '20%'
      },
      legend: {
        orient: 'vertical',
        top: 'center',
        right: 0,
        data: _.keys(_.omit(data, 'exploitation', 'exploration')),
      },
      title: {
        text: 'Mean Episode Reward (Zoom on best)',
        x: 'center',
      } as any,
      xAxis: {
        type: 'value',
        min: 1000,
      },
      yAxis: {
        type: 'value',
        min: 0.7,
        max: 0.82,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          label: {
            formatter: (params: any) => `episode: ${params.value}`
          }
        }
      },
      // dataZoom: [
      //   { show: true, xAxisIndex: [0], realtime: true },
      //   { type: 'inside', xAxisIndex: [0], realtime: true },
      // ],
      series: [..._.map(_.omit(data, 'exploitation', 'exploration'), (series, name) => ({
        type: 'line',
        name,
        tooltip: {
          valueFormatter: (value: any) => value.toFixed(6),
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
      <div className="mt-20" id="mean-episode-reward" />
      <div className="mt-20" id="zoom-on-best" />
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
