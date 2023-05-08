import * as _ from 'lodash'
import { expect } from 'chai'

import { Sentence } from '@TRE/logic/propositional-logic/sentence'
import { KnowledgeBase } from '@TRE/logic/propositional-logic/knowledge-base'

import { Pit, Wumpus, Breeze, Stench, Location, map } from '@TRE/logic/wumpus-world'

//   0             1           2           3
// 0 [GRID.EMPTY,  GRID.EMPTY, GRID.PIT,   GRID.EMPTY],
// 1 [GRID.EMPTY,  GRID.EMPTY, GRID.EMPTY, GRID.EMPTY],
// 2 [GRID.WUMPUS, GRID.GOLD,  GRID.PIT,   GRID.EMPTY],
// 3 [GRID.EMPTY,  GRID.EMPTY, GRID.EMPTY, GRID.PIT],

describe('PropositionalLogic#KnowledgeBase', () => {
  describe('KnowledgeBase#ttEntails', () => {
    it('should be able to do the inference correctly.', () => {
      const P00 = Pit(0, 0)
      const P01 = Pit(0, 1)
      const P02 = Pit(0, 2)
      const P10 = Pit(1, 0)
      const P11 = Pit(1, 1)
      const B00 = Breeze(0, 0)
      const B01 = Breeze(0, 1)
      // R1: ^P(0, 0) 
      const R1: Sentence = Sentence.NEGATE(new Sentence(P00))
      // R2: B(0, 0) <=> (P(0, 1), P(1, 0)) 
      const R2: Sentence = Sentence.IFF(
        new Sentence(B00),
        Sentence.OR(
          new Sentence(P01),
          new Sentence(P10)
        )
      )
      // R3: B(0, 1) <=> (P(0, 0) V P(1, 1) V P(0, 2)) 
      const R3: Sentence = Sentence.IFF(
        new Sentence(B01),
        Sentence.OR(
          new Sentence(P00),
          Sentence.OR(
            new Sentence(P11),
            new Sentence(P02),
          )
        )
      )
      // R4: ^B(0, 0) 
      const R4: Sentence = Sentence.NEGATE(new Sentence(B00))
      // R5: ^B(0, 1) 
      const R5: Sentence = new Sentence(B01)

      const kb = new KnowledgeBase()

      kb.symbols = [
        P00, P01, P02, P10, P11,
        B00, B01,
      ]
      kb.sentence = Sentence.AND(
        R1,
        Sentence.AND(R2, Sentence.AND(R3, Sentence.AND(R4, R5)))
      )

      const query = Sentence.NEGATE(new Sentence(P10))
      console.log(kb.ttEntails(query))
    })
  })
})