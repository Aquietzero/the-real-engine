import * as _ from 'lodash'
import { expect } from 'chai'
import { Sentence } from '@TRE/logic/propositional-logic/sentence'

describe('PropositionalLogic#CNF', () => {
  describe('CNF#eliminateDoubleNegate', () => {
    it('¬(¬A) -> A', () => {
      const s: Sentence = Sentence.NEGATE(Sentence.NEGATE(new Sentence('A')))
      expect(Sentence.toCNF(s).print()).to.equal('A')
    })
  })

  describe('CNF#deMorgan', () => {
    it('¬(A V B) -> ¬A ∧ ¬B', () => {
      const s: Sentence = Sentence.NEGATE(Sentence.AND(new Sentence('A'), new Sentence('B')))
      expect(Sentence.toCNF(s).print()).to.equal('(¬ (A)) ∨ (¬ (B))')
    })

    it('¬(A ∧ B) -> ¬A V ¬B', () => {
      const s: Sentence = Sentence.NEGATE(Sentence.OR(new Sentence('A'), new Sentence('B')))
      expect(Sentence.toCNF(s).print()).to.equal('(¬ (A)) ∧ (¬ (B))')
    })
  })

  describe('CNF#distributeOR', () => {
    it('A ∨ (B ∧ C) -> (A ∨ B) ∧ (B ∨ C)', () => {
      const s: Sentence = Sentence.OR(
        new Sentence('A'),
        Sentence.AND(new Sentence('B'), new Sentence('C'))
      )
      expect(Sentence.toCNF(s).print()).to.equal('((A) ∨ (B)) ∧ ((A) ∨ (C))')
    })

    it('(A ∧ B) ∨ C -> (A ∨ C) ∧ (B ∨ C)', () => {
      const s: Sentence = Sentence.OR(
        Sentence.AND(new Sentence('A'), new Sentence('B')),
        new Sentence('C')
      )
      expect(Sentence.toCNF(s).print()).to.equal('((A) ∨ (C)) ∧ ((B) ∨ (C))')
    })

    it('(A ∧ B) ∨ (C ∧ D) -> (A ∨ C) ∧ (B ∨ C) ∧ (A ∨ D) ∧ (B ∨ D)', () => {
      const s: Sentence = Sentence.OR(
        Sentence.AND(new Sentence('A'), new Sentence('B')),
        Sentence.AND(new Sentence('C'), new Sentence('D')),
      )
      expect(Sentence.toCNF(s).print()).to.equal('(((A) ∨ (C)) ∧ ((B) ∨ (C))) ∧ (((A) ∨ (D)) ∧ ((B) ∨ (D)))')
    })
  })
  // describe('CNF#toCNF', () => {
  //   it('should be able to convert the sentence to CNF', () => {
  //     const R: Sentence = Sentence.IFF(
  //       new Sentence(Breeze(1, 1)),
  //       Sentence.OR(
  //         new Sentence(Pit(1, 2)),
  //         new Sentence(Pit(2, 1))
  //       )
  //     )
  //     console.log(Sentence.toCNF(R).print())
  //   })
  // })
})