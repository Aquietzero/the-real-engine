import * as _ from 'lodash'
import { Model } from './knowledge-base'
import Semantics from './semantics'

export enum Connector {
  TRUE = 'TRUE',
  NEGATE = 'NEGATE',
  AND = 'AND',
  OR = 'OR',
  IMPLIES = 'IMPLIES',
  IFF = 'IFF',
}

export class Sentence {
  connector: Connector = Connector.TRUE
  sentences: Sentence[] = []
  
  constructor(symbol?: any) {
    if (symbol) {
      this.sentences = [symbol]
    }
  }

  // evaluate a sentence by a given model,
  // where the model is dynamic environment information.
  eval(model: Model): boolean {
    // symbol note, which has only one basic sentence.
    if (this.connector === Connector.TRUE) {
      const symbol: any = this.sentences[0]
      return symbol.eval(model)
    }

    const booleanValues = _.map(this.sentences, s => s.eval(model))
    return Semantics[this.connector](booleanValues)
  }

  // evaluate a sentence by truth value assignment to each of
  // the propositional symbols of the sentence.
  // The `truthValueAssignment` is given as
  // { [name of the symbol]: boolean }
  evalByTruthValueAssignment(truthValueAssignment: any): boolean {
    // symbol note, which has only one basic sentence.
    if (this.connector === Connector.TRUE) {
      const symbol: any = this.sentences[0]
      return truthValueAssignment[symbol.name]
    }

    const booleanValues = _.map(
      this.sentences,
      s => s.evalByTruthValueAssignment(truthValueAssignment)
    )
    return Semantics[this.connector](booleanValues)
  }

  print(): string {
    if (this.connector === Connector.TRUE) {
      const symbol: any = this.sentences[0]
      return symbol.name
    }

    const strings = _.map(this.sentences, s => s.print())
    const connectorSymbols = {
      NEGATE: (strings: string[]) => `¬ (${strings.join('')})`,
      AND: (strings: string[]) => strings.map(s => `(${s})`).join(' ∧ '),
      OR: (strings: string[]) => strings.map(s => `(${s})`).join(' ∨ '),
      IMPLIES: (strings: string[]) => `${strings[0]} => (${strings[1]})`,
      IFF: (strings: string[]) => `${strings[0]} <=> (${strings[1]})`,
    }
    return connectorSymbols[this.connector](strings)
  }

  toCNF(): Sentence {
    if (this.connector === Connector.TRUE) return this

    if (this.connector === Connector.IFF) {
      const [p, q] = this.sentences
      return Sentence.AND(
        Sentence.IMPLIES(p, q),
        Sentence.IMPLIES(q, p)
      ).toCNF()
    }

    if (this.connector === Connector.IMPLIES) {
      const [p, q] = this.sentences
      return Sentence.OR(
        Sentence.NEGATE(p),
        q
      ).toCNF()
    }

    const cnfs = _.map(this.sentences, s => s.toCNF())
    this.sentences = cnfs
    return this
  }

  static connect(connector: Connector, sentences: Sentence[]): Sentence {
    const s = new Sentence()
    s.connector = connector
    s.sentences = sentences
    return s
  }

  static NEGATE(s: Sentence): Sentence {
    return Sentence.connect(Connector.NEGATE, [s])
  }

  static AND(s1: Sentence, s2: Sentence): Sentence {
    return Sentence.connect(Connector.AND, [s1, s2])
  }

  static OR(s1: Sentence, s2: Sentence): Sentence {
    return Sentence.connect(Connector.OR, [s1, s2])
  }

  static IMPLIES(s1: Sentence, s2: Sentence): Sentence {
    return Sentence.connect(Connector.IMPLIES, [s1, s2])
  }

  static IFF(s1: Sentence, s2: Sentence): Sentence {
    return Sentence.connect(Connector.IFF, [s1, s2])
  }
}