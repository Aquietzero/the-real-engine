import * as _ from 'lodash'
import { Model } from './knowledge-base'
import Semantics from './semantics'
import { toCNF } from './cnf'

export type Symbol = string

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

  getSymbols(): Symbol[] {
    // symbol note, which has only one basic sentence.
    if (this.connector === Connector.TRUE) {
      const symbol: any = this.sentences[0]
      return [symbol]
    }

    return _.union(..._.map(this.sentences, s => s.getSymbols()))
  }
  // // evaluate a sentence by a given model,
  // // where the model is dynamic environment information.
  // eval(model: Model): boolean {
  //   // symbol note, which has only one basic sentence.
  //   if (this.connector === Connector.TRUE) {
  //     const symbol: any = this.sentences[0]
  //     return symbol.eval(model)
  //   }

  //   const booleanValues = _.map(this.sentences, s => s.eval(model))
  //   return Semantics[this.connector](booleanValues)
  // }

  // evaluate a sentence by truth value assignment to each of
  // the propositional symbols of the sentence.
  // The `truthValueAssignment` is given as
  // { [name of the symbol]: boolean }
  eval(model: Model): boolean {
    // symbol note, which has only one basic sentence.
    if (this.connector === Connector.TRUE) {
      const symbol: any = this.sentences[0]
      return model[symbol]
    }

    const booleanValues = _.map(
      this.sentences,
      s => s.eval(model)
    )
    return Semantics[this.connector](booleanValues)
  }

  print(): string {
    if (this.connector === Connector.TRUE) {
      const symbol: any = this.sentences[0]
      return symbol
    }

    // console.log(this.sentences)
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

  static toCNF(sentence: Sentence): Sentence {
    return toCNF(sentence)
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

  static EVERY(sentences: Sentence[]): Sentence {
    if (sentences.length === 0) return new Sentence()
    if (sentences.length === 1) return sentences[0]

    let s = Sentence.AND(sentences[0], sentences[1])
    for (let i = 2; i < sentences.length; i++) {
      s = Sentence.AND(s, sentences[i])
    }

    return s
  }

  static SOME(sentences: Sentence[]): Sentence {
    if (sentences.length === 0) return new Sentence()
    if (sentences.length === 1) return sentences[0]

    let s = Sentence.OR(sentences[0], sentences[1])
    for (let i = 2; i < sentences.length; i++) {
      s = Sentence.OR(s, sentences[i])
    }

    return s
  }
}