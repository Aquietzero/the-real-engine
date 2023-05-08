import * as _ from 'lodash'

export type Sentence = any
export type Symbol = any
export type Model = any

export class KnowledgeBase {
  sentence: Sentence
  symbols: Symbol[]

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

    const pTrueModel = { ...model, [p.name]: true }
    const pFalseModel = { ...model, [p.name]: false }
    return this.ttCheckAll(query, rest, pTrueModel) && this.ttCheckAll(query, rest, pFalseModel) 
  }

  // returns true if a sentence holds within a model.
  plTrue(sentence: Sentence, model: Model): boolean {
    return sentence.evalByTruthValueAssignment(model)
  }
}