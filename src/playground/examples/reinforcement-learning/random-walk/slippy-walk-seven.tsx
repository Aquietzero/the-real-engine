
import * as React from 'react'
import * as echarts from 'echarts'
import * as _ from 'lodash'
import d1 from '@TRE/reinforcement-learning/result/sws/state-value-evaluation-with-mc'
import d2 from '@TRE/reinforcement-learning/result/sws/state-value-evaluation-with-sarsa'
import d3 from '@TRE/reinforcement-learning/result/sws/state-value-evaluation-with-qLearning'
import d4 from '@TRE/reinforcement-learning/result/sws/state-value-evaluation-with-doubleQLearning'

const results = [{
  data: d1,
  name: 'Monte Carlo',
  el: 'mc',
}, {
  data: d2,
  name: 'SARSA',
  el: 'sarsa',
}, {
  data: d3,
  name: 'Q Learning',
  el: 'q-learning',
}, {
  data: d4,
  name: 'Double Q Learning',
  el: 'double-q-learning',
}]

const correctStateValue: any = {
  0: 0,
  1: 0.5637385603297012,
  2: 0.7630400717021056,
  3: 0.8448888599241188,
  4: 0.889240251264577,
  5: 0.9219884979713453,
  6: 0.9515306105078061,
  7: 0.9806008219867679,
  8: 0
}

const byState = (QTrack: number[][][]) => {
  const stateValues = _.map(QTrack[0], (stateActionValue, index) => {
    return _.map(QTrack, stateActionValue => _.max(stateActionValue[index]))
  })
  // remove initial and last state
  stateValues.shift()
  stateValues.pop()
  return stateValues
}

const StateValueEvaluation: React.FC = () => {

  React.useEffect(() => {
    _.each(results, (result: any) => {
      const data = byState(result.data.QTrack)
      const chart = echarts.init(document.getElementById(result.el))

      chart.resize({ width: 1200, height: 500 })

      chart.setOption({
        grid: {
          right: '20%'
        },
        legend: {
          orient: 'vertical',
          top: 'center',
          right: 0,
          data: _.keys(_.range(result.data.V.length)),
        },
        title: {
          text: result.name,
          x: 'center',
        } as any,
        xAxis: {
          type: 'value',
          min: 30,
        } as any,
        yAxis: {
          type: 'value',
          splitLine: {
            show: true,
          }
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
        series: [..._.map(data, (nState, index) => ({
          type: 'line',
          name,
          tooltip: {
            valueFormatter: (value: any) => value.toFixed(6),
          },
          data: _.map(nState, (y, x) => [x.toFixed(0), y]),
          symbol: 'none',
          smooth: true,
          lineStyle: {
            // color: 'black',
          },
          markLine: {
            symbol: ['none', 'none'],
            data: [
              {
                yAxis: correctStateValue[index + 1],
                lineStyle: { type: 'solid', color: '#000' },
                label: { formatter: `v(s${index+1}) = {c}` },
                emphasis: { disabled: true },
              },
            ]
          }
        }))] as any
      })
    })
  })

  return (
    <div className="flex flex-col">
      <h2 className="mt-10">Slippy Walk Seven</h2>
      <div className="mt-20" id="mc" />
      <div className="mt-20" id="sarsa" />
      <div className="mt-20" id="q-learning" />
      <div className="mt-20" id="double-q-learning" />
    </div>
  )
}

export default {
  description: 'state value evaluation.',
  notCanvas: true,
  run(app: any) {
    return (
      <div className="w-full h-full flex justify-center overflow-scroll">
        <StateValueEvaluation />
      </div>
    )
  },
}
