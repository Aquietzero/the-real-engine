import * as _ from 'lodash'
import { DiscreteRandomVariable, Entropy } from "./entropy"

export class Examples {
  data: any[] = []
  columns: DiscreteRandomVariable<any>[]

  constructor(data: any[], columns: DiscreteRandomVariable<any>[]) {
    this.data = data
    this.columns = columns
  }

  // determines whether the data set is empty
  isEmpty(): boolean {
    return this.data.length === 0
  }

  // calculate information gain of given attribute
  gain(rv: DiscreteRandomVariable<any>) {
    const idx = _.findIndex(this.columns, { name : rv.name })
    const counter = _.countBy(this.data, _.last)
    const p = counter['true']
    const n = counter['false']
    const b = Entropy.b(p / (p + n))

    let remainder = 0
    _.each(rv.values, value => {
      const examples = this.filter({ [rv.name]: value })
      const counterK = _.countBy(examples.data, _.last)
      const pk = counterK['true'] || 0
      const nk = counterK['false'] || 0
      if (!pk || !nk) return
      remainder += (pk + nk) * Entropy.b(pk / (pk + nk)) / (p + n)
    })

    return b - remainder
  }

  selectAttribute(attributes: DiscreteRandomVariable<any>[]) {
    return _.maxBy(attributes, this.gain.bind(this))
  }

  // filter example data by query
  filter(query: any): Examples {
    const q: { idx: number, val: any }[] = []
    _.each(query, (val, key) => {
      const idx = _.findIndex(this.columns, { name: key })
      q.push({ idx, val })
    })

    const filteredData = _.filter(this.data, d => {
      return _.every(q, cond => d[cond.idx] === cond.val)
    })
    return new Examples(filteredData, this.columns)
  }

  // return the possible classifications of example data
  getClassifications() {
    return _.uniq(_.map(this.data, _.last))
  }

  // return the most common output value among a set of example data
  pluralityValue() {
    // { [output]: count }
    const counter = _.countBy(_.map(this.data, _.last))
    // [[output, count]]
    const max = _.maxBy(_.entries(counter), pair => pair[1])
    // TODO return the actual output value
    return max[0] === 'true'
  }
}