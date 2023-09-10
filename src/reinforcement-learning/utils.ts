export const zeros = (n: number) => {
  return new Array(n).fill(0)
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
