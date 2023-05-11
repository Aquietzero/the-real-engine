import * as _ from 'lodash'
import { expect } from 'chai'
import { Sentence } from '@TRE/logic/propositional-logic/sentence'
import { Symbols } from '@TRE/logic/wumpus-world'

const { Pit, Breeze } = Symbols

describe('PropositionalLogic#Sentence', () => {
  describe('Sentence#getSymbols', () => {
    it('should be able to get symbols of a sentence', () => {
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

      const R1Symbols = R1.getSymbols()
      expect(R1Symbols.length).to.equal(1)
      expect(R1Symbols[0]).to.equal('Pit(1, 1)')

      const R2Symbols = R2.getSymbols()
      expect(R2Symbols.length).to.equal(3)
      expect(R2Symbols).to.include.members(['Breeze(1, 1)', 'Pit(1, 2)', 'Pit(2, 1)'])
    })
  })

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

      expect(R1.eval({
        'Pit(1, 1)': false,
      })).to.be.true
      expect(R2.eval({
        'Breeze(1, 1)': true,
        'Pit(2, 1)': true,
        'Pit(1, 2)': true,
      })).to.be.true
      expect(R3.eval({
        'Breeze(2, 1)': true,
        'Pit(1, 1)': true,
        'Pit(2, 2)': true,
        'Pit(3, 2)': true,
      })).to.be.true

      console.log(R1.print())
      console.log(R2.print())
      console.log(R3.print())
    })
  })
})
