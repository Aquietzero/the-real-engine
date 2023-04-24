import * as _ from 'lodash'
import { expect } from 'chai'
import { Examples } from '@TRE/machine-learning/core/examples'
import { DecisionTreeLearner } from '@TRE/machine-learning/decision-tree-learner'

const columns = [
  { name: 'Alternative', values: [true, false] },
  { name: 'Bar', values: [true, false] },
  { name: 'Friday', values: [true, false] },
  { name: 'Hungry', values: [true, false] },
  { name: 'Patrons', values: ['Some', 'Full', 'None'] },
  { name: 'Price', values: ['$', '$$', '$$$'] },
  { name: 'Rain', values: [true, false] },
  { name: 'Reservation', values: [true, false] },
  { name: 'Type', values: ['French', 'Thai', 'Italian', 'Burger'] },
  { name: 'WaitEstimate', values: ['0-10', '10-30', '30-60', '>60'] },
]

describe('MachineLearning', () => {
  describe('#learnDecisionTree', () => {
    it('should construct a decision tree successfully', () => {
      const data = [
        // alt bar    friday hun   pat     price  rain   res   type      est
        [true, false, false, true, 'Some', '$$$', false, true, 'French', '0-10', true],
        [true, false, false, true, 'Full', '$', false, false, 'Thai', '30-60', false],
        [false, true, false, false, 'Some', '$', false, false, 'Burger', '0-10', true],
        [true, false, true, true, 'Full', '$', true, false, 'Thai', '10-30', true],
        [true, false, true, false, 'Full', '$$$', false, true, 'French', '>60', false],
        [false, true, false, true, 'Some', '$$', true, true, 'Italian', '0-10', true],
        [false, true, false, false, 'None', '$', true, false, 'Burger', '0-10', false],
        [false, false, false, true, 'Some', '$$', true, true, 'Thai', '0-10', true],
        [false, true, true, false, 'Full', '$', true, false, 'Burger', '>60', false],
        [true, true, true, true, 'Full', '$$$', false, true, 'Italian', '10-30', false],
        [false, false, false, false, 'None', '$', false, false, 'Thai', '0-10', false],
        [true, true, true, true, 'Full', '$', false, false, 'Burger', '30-60', true],
      ]

      const examples = new Examples(data, columns)
      const learner = new DecisionTreeLearner(examples, columns)
      learner.learn()
      console.log(learner.tree)
    })
  })
})