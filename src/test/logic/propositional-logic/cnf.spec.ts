import * as _ from 'lodash'
import { expect } from 'chai'
import { Sentence } from '@TRE/logic/propositional-logic/sentence'
import { toCNF, getClauses } from '@TRE/logic/propositional-logic/cnf'

describe('PropositionalLogic#CNF', () => {
  describe('CNF#eliminateDoubleNegate', () => {
    it('¬(¬A) -> A', () => {
      const s: Sentence = Sentence.NEGATE(Sentence.NEGATE(new Sentence('A')))
      expect(toCNF(s).print()).to.equal('A')
    })
  })

  describe('CNF#deMorgan', () => {
    it('¬(A V B) -> ¬A ∧ ¬B', () => {
      const s: Sentence = Sentence.NEGATE(Sentence.AND(new Sentence('A'), new Sentence('B')))
      expect(toCNF(s).print()).to.equal('(¬ (A)) ∨ (¬ (B))')
    })

    it('¬(A ∧ B) -> ¬A V ¬B', () => {
      const s: Sentence = Sentence.NEGATE(Sentence.OR(new Sentence('A'), new Sentence('B')))
      expect(toCNF(s).print()).to.equal('(¬ (A)) ∧ (¬ (B))')
    })
  })

  describe('CNF#distributeOR', () => {
    it('A ∨ (B ∧ C) -> (A ∨ B) ∧ (B ∨ C)', () => {
      const s: Sentence = Sentence.OR(
        new Sentence('A'),
        Sentence.AND(new Sentence('B'), new Sentence('C'))
      )
      expect(toCNF(s).print()).to.equal('((A) ∨ (B)) ∧ ((A) ∨ (C))')
    })

    it('(A ∧ B) ∨ C -> (A ∨ C) ∧ (B ∨ C)', () => {
      const s: Sentence = Sentence.OR(
        Sentence.AND(new Sentence('A'), new Sentence('B')),
        new Sentence('C')
      )
      expect(toCNF(s).print()).to.equal('((A) ∨ (C)) ∧ ((B) ∨ (C))')
    })

    it('(A ∧ B) ∨ (C ∧ D) -> (A ∨ C) ∧ (B ∨ C) ∧ (A ∨ D) ∧ (B ∨ D)', () => {
      const s: Sentence = Sentence.OR(
        Sentence.AND(new Sentence('A'), new Sentence('B')),
        Sentence.AND(new Sentence('C'), new Sentence('D')),
      )
      expect(toCNF(s).print()).to.equal('(((A) ∨ (C)) ∧ ((B) ∨ (C))) ∧ (((A) ∨ (D)) ∧ ((B) ∨ (D)))')
    })
  })

  describe('CNF#getClauses', () => {
    it('(A ∨ C) ∧ (B ∨ C) ∧ (A ∨ D) ∧ (B ∨ D) -> [(A ∨ C), (B ∨ C), (A ∨ D), (B ∨ D)]', () => {
      const s: Sentence = Sentence.OR(
        Sentence.AND(new Sentence('A'), new Sentence('B')),
        Sentence.AND(new Sentence('C'), new Sentence('D')),
      )
      const cnf = toCNF(s)
      console.log(_.map(getClauses(cnf), s => s.print()))
    })
  })
})