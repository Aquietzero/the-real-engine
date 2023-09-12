import * as _ from 'lodash'

export const zeros = (n: number) => {
  return new Array(n).fill(0)
}

export const full = (n: number, val: number = 0) => {
  return new Array(n).fill(val)
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
  let maxIndex = -1
  for (let i = 0; i < arr.length; ++i) {
    if (arr[i] > max) {
      max = arr[i]
      maxIndex = i
    }
  }
  return maxIndex
}

export const logspace = (start: number, end: number, num: number): number[] => {
  const result: number[] = []
  const step = (end - start) / (num - 1)

  for (let i = 0; i < num; i++) {
    const value = Math.pow(10, start + i * step)
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
