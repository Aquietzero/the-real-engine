import * as _ from 'lodash'

// the range of a discrete random variable can be specified
export interface DiscreteRandomVariable<T> {
  name: string
  values: T[]
  pdf?: {(v: T): number}
}

// calculate the entropy of a given random variable
const h = <T>(v: DiscreteRandomVariable<T>): number => {
  return -_.reduce(v.values, (sum, value) => {
    const p = v.pdf(value)
    return sum + p * Math.log2(p)
  }, 0)
}

// calculate the entropy of a Boolean random variable
const b = (q: number): number => {
  return -(q * Math.log2(q) + (1 - q) * Math.log2(1 - q))
}

export const Entropy = {
  h,
  b,
}