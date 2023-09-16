
import * as React from 'react'
import * as echarts from 'echarts'
import * as _ from 'lodash'
import d1 from '@TRE/reinforcement-learning/result/random-walk/state-value-evaluation-with-mc'
import d2 from '@TRE/reinforcement-learning/result/random-walk/state-value-evaluation-with-td'

const byState = (VTrack: number[][]) => {
  return _.map(VTrack[0], (stateValue, index) => {
    return _.map(VTrack, V => V[index])
  })
}

const StateValueEvaluation: React.FC = () => {
  const data1 = byState(d1.VTrack)
  const data2 = byState(d2.VTrack)

  React.useEffect(() => {
    const chart1 = echarts.init(document.getElementById('mc'))
    const chart2 = echarts.init(document.getElementById('td'))

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
        data: _.keys(_.range(d1.V.length)),
      },
      title: {
        text: 'Monte Carlo Method',
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
      series: [..._.map(data1, (nState, index) => ({
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
        data: _.keys(_.range(d2.V.length)),
      },
      title: {
        text: 'Temporal Difference Method',
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
      series: [..._.map(data2, (nState, index) => ({
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
        }
      }))] as any
    })
  })

  return (
    <div className="flex flex-col">
      <h2 className="mt-10">Random Walk</h2>
      <div className="mt-20" id="mc" />
      <div className="mt-20" id="td" />
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
