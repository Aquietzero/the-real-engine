import * as _ from 'lodash'
import { Sentence, Connector } from "./sentence"

// eliminate <=>
// eliminate =>
// de morgan (spread negate)
// eliminate negate
const eliminateIFF = (s: Sentence): Sentence => {
  if (s.connector === Connector.TRUE) return s

  if (s.connector === Connector.IFF) {
    const [p, q] = s.sentences
    return eliminateIFF(Sentence.AND(
      Sentence.IMPLIES(p, q),
      Sentence.IMPLIES(q, p)
    ))
  }

  s.sentences = _.map(s.sentences, eliminateIFF)
  return s
}

const eliminateIMPLIES = (s: Sentence): Sentence => {
  if (s.connector === Connector.TRUE) return s

  if (s.connector === Connector.IMPLIES) {
    const [p, q] = s.sentences
    return eliminateIMPLIES(Sentence.OR(Sentence.NEGATE(p), q))
  }

  s.sentences = _.map(s.sentences, eliminateIMPLIES)
  return s
}

const deMorgan = (s: Sentence): Sentence => {
  if (s.connector === Connector.TRUE) return s

  // convert ¬ (A v B) to ¬ A ^ ¬ B
  // convert ¬ (A ^ B) to ¬ A v ¬ B
  if (s.connector === Connector.NEGATE) {
    const negClause = s.sentences[0]
    if (negClause.connector === Connector.OR) {
      const [p, q] = negClause.sentences
      return deMorgan(Sentence.AND(Sentence.NEGATE(p), Sentence.NEGATE(q)))
    }
    if (negClause.connector === Connector.AND) {
      const [p, q] = negClause.sentences
      return deMorgan(Sentence.OR(Sentence.NEGATE(p), Sentence.NEGATE(q)))
    }
  }

  s.sentences = _.map(s.sentences, deMorgan)
  return s
}

const eliminateDoubleNegate = (s: Sentence): Sentence => {
  if (s.connector === Connector.TRUE) return s

  // convert ¬ (¬ A) to  A
  if (s.connector === Connector.NEGATE) {
    const negClause = s.sentences[0]
    if (negClause.connector === Connector.NEGATE) {
      return eliminateDoubleNegate(negClause.sentences[0])
    }
  }

  s.sentences = _.map(s.sentences, eliminateDoubleNegate)
  return s
}

const distributeOR = (s: Sentence): Sentence => {
  if (s.connector === Connector.TRUE) return s

  if (s.connector === Connector.OR) {
    const [p, q] = s.sentences

    if (q.connector === Connector.AND) {
      return distributeOR(Sentence.AND(
        Sentence.OR(p, q.sentences[0]),
        Sentence.OR(p, q.sentences[1]),
      ))
    }

    if (p.connector === Connector.AND) {
      return distributeOR(Sentence.AND(
        Sentence.OR(p.sentences[0], q),
        Sentence.OR(p.sentences[1], q),
      ))
    }
  }

  s.sentences = _.map(s.sentences, distributeOR)
  return s
}

export const toCNF = (sentence: Sentence): Sentence => {
  let s = eliminateIFF(sentence)
  s = eliminateIMPLIES(s)
  s = deMorgan(s)
  s = eliminateDoubleNegate(s)
  s = distributeOR(s)
  return s
}