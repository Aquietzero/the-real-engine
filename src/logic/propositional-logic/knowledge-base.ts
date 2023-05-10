import * as _ from 'lodash'
import { Sentence, Symbol } from './sentence'

export type Model = any

export class KnowledgeBase {
  sentence: Sentence = new Sentence()
  symbols: Symbol[]

  tell(sentence: Sentence) {
    this.sentence = Sentence.AND(this.sentence, sentence)

    const newSymbols = sentence.getSymbols()
    this.symbols = _.uniq(_.union(this.symbols, newSymbols))
  }

  ask(sentence: Sentence): boolean {
    return this.ttEntails(sentence)
  }

  // truth-table enumeration algorithm
  ttEntails(query: Sentence): boolean {
    return this.ttCheckAll(query, this.symbols)
  }

  ttCheckAll(query: Sentence, symbols: Symbol[], model: Model = {}): boolean {
    if (!symbols.length) {
      if (this.plTrue(this.sentence, model)) return this.plTrue(query, model)
      // when KB is false, always return true
      return true
    }

    const [p, ...rest] = symbols

    const pTrueModel = { ...model, [p]: true }
    const pFalseModel = { ...model, [p]: false }
    return this.ttCheckAll(query, rest, pTrueModel) && this.ttCheckAll(query, rest, pFalseModel) 
  }

  // returns true if a sentence holds within a model.
  plTrue(sentence: Sentence, model: Model): boolean {
    return sentence.eval(model)
  }
}