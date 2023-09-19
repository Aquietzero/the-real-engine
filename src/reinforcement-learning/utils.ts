import * as _ from 'lodash'

export const zeros = (n: number) => {
  return new Array(n).fill(0)
}

export const full = (n: number | number[], val: any = 0) => {
  if (!_.isArray(n)) return new Array(n).fill(val)
  const [row, col] = n
  return new Array(row).fill(new Array(col).fill(val))
}

export const empty = (row: number, col?: number) => {
  if (!col) return zeros(row)
  return new Array(row).fill(new Array(col).fill(0))
}

export const clip = (value: number, min?: number, max?: number) => {
  if (min) value = value < min ? min : value
  if (max) value = value > max ? max : value
  return value
}

export const argmax = (arr: number[] = []) => {
  let max = -Infinity
  // make sure to return at least a valid index
  let maxIndex = 0
  for (let i = 0; i < arr.length; ++i) {
    if (arr[i] > max) {
      max = arr[i]
      maxIndex = i
    }
  }
  return maxIndex
}

export const logspace = (
  start: number,
  stop: number,
  num: number,
  logBase: number = 10,
  endPoint: boolean = true
): number[] => {
  const result: number[] = []
  const step = (stop - start) / (num - 1)

  const end = endPoint ? num : num - 1
  // including the end
  for (let i = 0; i <= end; i++) {
    const value = Math.pow(logBase, start + i * step)
    result.push(value)
  }

  return result
}

export const pad = (
  arr: number[],
  padWidth: [left: number, right: number] = [0, 0],
  mode: 'edge' = 'edge'
): number[] => {
  const result = [...arr]
  const [left, right] = padWidth
  const first = _.first(arr)
  const last = _.last(arr)

  _.times(left, (index) => {
    result.unshift(first)
  })
  _.times(right, (index) => {
    result.push(last)
  })

  return result
}

// return a choice based on probability distribution
export const choice = (pd: number[]): number => {
  const p = Math.random()
  let cumulatedProbability = 0
  for (let i = 0; i < pd.length; ++i) {
    cumulatedProbability += pd[i]
    if (p < cumulatedProbability) {
      return i
    }
  }
  return 0
}

// Ref: https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
export const randomNormal = (mean: number = 0, stdDev: number = 1): number => {
  const u = 1 - Math.random() // Converting [0,1) to (0,1]
  const v = Math.random()
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  // Transform to the desired mean and standard deviation:
  return z * stdDev + mean
}

export const decaySchedule = (
  initValue: number,
  minValue: number,
  decayRatio: number,
  maxSteps: number,
  logStart: number = -2,
  logBase: number = 10
) => {
  const decaySteps = Math.floor(maxSteps * decayRatio)
  const remSteps = maxSteps - decaySteps

  let values = _.reverse(logspace(logStart, 0, decaySteps, logBase))
  const min = _.min(values)
  const max = _.max(values)
  values = _.map(values, (value) => (value - min) / (max - min))
  values = _.map(values, (value) => minValue + (initValue - minValue) * value)
  values = pad(values, [0, remSteps])

  return values
}

export const dot = (v1: number[], v2: number[]) => {
  if (v1.length !== v2.length) {
    throw '[dot]: shapes of v1 and v2 are not aligned'
  }

  let sum = 0
  for (let i = 0; i < v1.length; ++i) {
    sum += v1[i] * v2[i]
  }
  return sum
}
