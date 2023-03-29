import * as _ from 'lodash'
import { expect } from 'chai'
import { Examples } from '@TRE/machine-learning/core/examples'
import { DiscreteRandomVariable } from '@TRE/machine-learning/core/entropy'

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

describe('MachineLearning#Examples', () => {
  describe('#constructor', () => {
    it('should be construct an example with 2 records', () => {
      const data = [
        // alt bar    friday hun   pat     price  rain   res   type      est
        [true, false, false, true, 'Some', '$$$', false, true, 'French', '0-10', true],
        [true, false, false, true, 'Full', '$', false, false, 'Thai', '30-60', false],
      ]

      const examples = new Examples(data, columns)
      expect(examples.data.length).to.equal(2)
    })
  })

  describe('#getClassifications', () => {
    it('should return 2 classifications', () => {
      const data = [
        // alt bar    friday hun   pat     price  rain   res   type      est
        [true, false, false, true, 'Some', '$$$', false, true, 'French', '0-10', true],
        [true, false, false, true, 'Full', '$', false, false, 'Thai', '30-60', false],
      ]

      const examples = new Examples(data, columns)
      expect(examples.getClassifications().length).to.equal(2)
    })

    it('should return 1 classifications', () => {
      const data = [
        // alt bar    friday hun   pat     price  rain   res   type      est
        [true, false, false, true, 'Some', '$$$', false, true, 'French', '0-10', true],
        [true, false, false, true, 'Full', '$', false, false, 'Thai', '30-60', true],
      ]

      const examples = new Examples(data, columns)
      const classifications = examples.getClassifications()
      expect(classifications.length).to.equal(1)
      expect(classifications[0]).to.be.true
    })
  })

  describe('#pluralityValue', () => {
    it('should return the classification with most records of data', () => {
      const data = [
        // alt bar    friday hun   pat     price  rain   res   type      est
        [true, false, false, true, 'Some', '$$$', false, true, 'French', '0-10', true],
        [true, false, false, true, 'Some', '$$', false, true, 'French', '0-10', true],
        [true, false, false, true, 'Full', '$', false, false, 'Thai', '30-60', false],
      ]

      const examples = new Examples(data, columns)
      expect(examples.pluralityValue()).to.be.true
    })
  })
})