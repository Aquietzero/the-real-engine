import * as _ from 'lodash'
import { DiscreteRandomVariable } from './core/entropy'
import { Node } from './core/tree'
import { Examples } from './core/examples'

class DecisionTree extends Node {
  attribute: DiscreteRandomVariable<any>
  value: any
  result: any

  constructor() {
    super()
  }

  static leaf(result: any): DecisionTree {
    const node = new DecisionTree()
    node.result = result
    return node
  }
}

export const learnDecisionTree = (
  examples: Examples,
  attributes: DiscreteRandomVariable<any>[],
  parentExamples?: Examples
): DecisionTree => {
  // no more examples
  if (examples.isEmpty()) {
    return DecisionTree.leaf(parentExamples?.pluralityValue())
  }

  // all examples share the same classification (has the same label)
  const classifications = examples.getClassifications()
  const leaf = new DecisionTree()
  leaf.result = classifications[0]
  if (classifications.length === 1) return leaf

  // no more attributes
  if (attributes.length === 0) {
    return DecisionTree.leaf(examples.pluralityValue())
  }

  const a = examples.selectAttribute(attributes)
  const restAttributes = _.filter(attributes, attribute => attribute.name !== a.name)
  const tree = new DecisionTree()
  tree.attribute = a

  _.each(a.values, value => {
    const exs = examples.filter({ [a.name]: value })
    const subTree = learnDecisionTree(exs, restAttributes, examples)
    subTree.value = value
    tree.children.push(subTree)
  })

  return tree
}