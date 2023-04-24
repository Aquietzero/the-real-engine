import * as _ from 'lodash'

export class LinearRegressionLearner {
  univariate(data: any) {
    const n = data.length
    let sumXY = 0
    let sumX = 0
    let sumY = 0
    let sumX2 = 0

    _.each(data, ([x, y]) => {
      sumXY += x * y
      sumX += x
      sumY += y
      sumX2 += x * x
    })

    const w1 = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
    const w0 = (sumY - w1 * sumX) / n

    return (x: number) => w1 * x + w0
  }

  loss(data: any, hw: any): number {
    return _.reduce(data, (sum, [x, y]) => {
      return sum + (y - hw(x)) * (y - hw(x))
    }, 0)
  }

  isConverge(n: number): boolean {
    return Math.abs(n) < 0.01
  }

  // a: learning rate
  // algorithm: gradient descent 
  learn(data: any, a: number, maxIteration: number = 100) {
    let w0 = 1
    let w1 = 1
    let loss = Infinity
    let hw = (x: number) => w1 * x + w0
    let iterations = 0

    const learningCurve = []

    while (!this.isConverge(loss) && iterations < maxIteration) {
      let sum1 = 0
      let sum2 = 0
      _.each(data, ([x, y]) => {
        sum1 += y - hw(x)
        sum2 += (y - hw(x)) * x
      })
      w0 = w0 + a * sum1
      w1 = w1 + a * sum2
      hw = (x: number) => w1 * x + w0
      loss = this.loss(data, hw)
      iterations += 1

      learningCurve.push([iterations, loss])
    }

    return { hw, learningCurve }
  }
}