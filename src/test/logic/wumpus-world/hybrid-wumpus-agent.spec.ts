import * as _ from 'lodash'
import { expect } from 'chai'
import { Sentence } from '@TRE/logic/propositional-logic/sentence'
import { Symbols } from '@TRE/logic/wumpus-world'
import { HybridWumpusAgent } from '@TRE/logic/hybrid-wumpus-agent'

const { Pit, Breeze } = Symbols

describe('HybridWumpusAgent', () => {
  describe('HybridWumpusAgent#constructor', () => {
    it('should set all axioms correctly', () => {
      const agent = new HybridWumpusAgent()

      console.log(agent.knowledgeBase.symbols)

      // const is00OK = agent.ask(new Sentence(Symbols.OK(0, 0, 0)))
      // console.log('is ok', is00OK)
    })
  })
})