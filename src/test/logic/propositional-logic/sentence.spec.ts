import * as _ from 'lodash'
import { expect } from 'chai'

import { Sentence } from '@TRE/logic/propositional-logic/sentence'
import { Model } from '@TRE/logic/propositional-logic/knowledge-base'

import { Pit, Wumpus, Breeze, Stench, Location, map } from '@TRE/logic/wumpus-world'

describe('PropositionalLogic#Sentence', () => {
  describe('Sentence#eval', () => {
    it('should be able to be evaluated correctly by the given model', () => {
      // R1: ^P(1, 1) 
      const R1: Sentence = Sentence.NEGATE(new Sentence(Pit(1, 1)))
      // R2: B(1, 1) <=> (P(1, 2), P(2, 1)) 
      const R2: Sentence = Sentence.IFF(
        new Sentence(Breeze(1, 1)),
        Sentence.OR(
          new Sentence(Pit(1, 2)),
          new Sentence(Pit(2, 1))
        )
      )
      // R3: B(2, 1) <=> (P(1, 1) V P(2, 2) V P(3, 1)) 
      const R3: Sentence = Sentence.IFF(
        new Sentence(Breeze(2, 1)),
        Sentence.OR(
          new Sentence(Pit(1, 1)),
          Sentence.OR(
            new Sentence(Pit(2, 2)),
            new Sentence(Pit(3, 1)),
          )
        )
      )

      const model = { map }
      expect(R1.eval(model)).to.be.true
      expect(R2.eval(model)).to.be.true
      expect(R3.eval(model)).to.be.true

      console.log(R1.print())
      console.log(R2.print())
      console.log(R3.print())
    })
  })

  describe('Sentence#evalByTruthValueAssignment', () => {
    it('should be able to be evaluated correctly by the given truth value assignment', () => {
      // R1: ^P(1, 1) 
      const R1: Sentence = Sentence.NEGATE(new Sentence(Pit(1, 1)))
      // R2: B(1, 1) <=> (P(1, 2), P(2, 1)) 
      const R2: Sentence = Sentence.IFF(
        new Sentence(Breeze(1, 1)),
        Sentence.OR(
          new Sentence(Pit(1, 2)),
          new Sentence(Pit(2, 1))
        )
      )

      expect(R1.evalByTruthValueAssignment({ 'Pit(1, 1)': true })).to.be.false
      expect(R1.evalByTruthValueAssignment({ 'Pit(1, 1)': false })).to.be.true
    })
  })

  describe('Sentence#toCNF', () => {
    it('should be able to convert the sentence to CNF', () => {
      const R: Sentence = Sentence.IFF(
        new Sentence(Breeze(1, 1)),
        Sentence.OR(
          new Sentence(Pit(1, 2)),
          new Sentence(Pit(2, 1))
        )
      )
      console.log(R.toCNF().print())
    })
  })
})
