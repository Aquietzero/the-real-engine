import * as _ from 'lodash'
import * as React from 'react'
import * as echarts from 'echarts'
import { LinearRegressionLearner } from '@TRE/machine-learning/linear-regression-learner'

type LinearFunction = (x: number) => number

const randomData = (n: number = 100, f: LinearFunction, noise: number = 0) => {
  return _.times(n, () => {
    const x = _.random(0, 10, true)
    const y = f(x) * (1 + _.random(-noise, noise))
    return [ x, y ]
  })
}

const interpolate = (range: [number, number], intervals: number, f: LinearFunction) => {
  const [start, end] = range
  const step = (end - start) / intervals
  const data = []
  for (let x = start; x < end; x += step) {
    data.push([x, f(x)])
  }
  return data
}

export const LinearRegression: React.FC = () => {
  let data = _.sortBy(randomData(20, (x) => 2 * x, 0.2), d => d[0])

  const learner = new LinearRegressionLearner()


  const hw1 = learner.univariate(data)
  const { hw: hw2, learningCurve } = learner.learn(data, 0.001, 80)


  React.useEffect(() => {
    const chart1 = echarts.init(document.getElementById('plot1'))
    const chart2 = echarts.init(document.getElementById('plot2'))
    const chart3 = echarts.init(document.getElementById('plot3'))
    chart1.setOption({
      title: {
        text: 'Linear Regression',
      },
      xAxis: { type: 'value' },
      yAxis: { type: 'value' },
      series: [{
        type: 'scatter',
        data: _.map(data, ([x, y]) => [x, y]),
      }, {
        type: 'line',
        data: _.map(data, ([x, y]) => [x, hw1(x)]),
        symbol: 'none',
        lineStyle: {
          color: 'black',
        }
      }]
    })
    chart2.setOption({
      title: {
        text: 'Linear Regression',
      },
      xAxis: { type: 'value' },
      yAxis: { type: 'value' },
      series: [{
        type: 'scatter',
        data: _.map(data, ([x, y]) => [x, y]),
      }, {
        type: 'line',
        symbol: 'none',
        data: _.map(data, ([x, y]) => [x, hw2(x)]),
        lineStyle: {
          color: 'black',
        }
      }]
    })
    chart3.setOption({
      title: {
        text: 'Linear Regression Learning Curve',
      },
      xAxis: { type: 'value' },
      yAxis: { type: 'value' },
      series: [{
        type: 'line',
        symbol: 'none',
        data: learningCurve,
        lineStyle: {
          color: 'black',
        }
      }]
    })
  }, [])

  return (
    <div>
      <div id="plot1" style={{ width: 400, height: 300 }} />
      <div id="plot2" style={{ width: 400, height: 300 }} />
      <div id="plot3" style={{ width: 400, height: 300 }} />
    </div>
  )
}

export default {
  description: 'linear regression',
  notCanvas: true,
  run(app: any) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <LinearRegression />
      </div>
    )
  }
}
