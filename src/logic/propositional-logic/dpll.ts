import * as _ from 'lodash'
import { Sentence, Symbol } from './sentence'
import { toCNF } from './cnf'
import { Model } from './knowledge-base'

export const dpllSatisfiable = (sentence: Sentence): boolean => {
  const cnf = toCNF(sentence)
  const clauses = cnf.getClauses()
  const symbols = cnf.getSymbols()

  return dpll(clauses, symbols, {})
}

export const dpll = (clauses: Sentence[], symbols: Symbol[], model: Model = {}): boolean => {
  if (_.every(clauses, clause => clause.eval(model))) return true
  if (_.some(clauses, clause => clause.eval(model))) return false

  const [p, pValue] = findPureSymbol(symbols, clauses, model)
  if (p) return dpll(clauses, _.without(symbols, p), { ...model, [p]: pValue })

  const [q, qValue] = findUnitClause(clauses, model)
  if (q) return dpll(clauses, _.without(symbols, p), { ...model, [q]: qValue })

  const [first, ...rest] = symbols
  return dpll(clauses, rest, { ...model, [first]: true })
    || dpll(clauses, rest, { ...model, [first]: false })
}

const findPureSymbol = (symbols: Symbol[], clauses: Sentence[], model: Model): any => {
}

const findUnitClause = (clauses: Sentence[], model: Model): any => {
}