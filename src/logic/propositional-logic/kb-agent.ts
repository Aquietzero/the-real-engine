import { KnowledgeBase } from "./knowledge-base"
import { Sentence } from "./sentence"

export type Percept = any
export type Action = any

export class KBAgent {
  knowledgeBase: KnowledgeBase = new KnowledgeBase()
  // time step
  t: number = 0

  run(percept: Percept): Action {
    this.tell(this.makePerceptSentence(percept))
    const action: Action = this.ask(this.makeActionQuery())
    this.tell(this.makeActionSentence(action))
    this.t += 1
    return action
  }

  tell(sentence: Sentence) {
    this.knowledgeBase.tell(sentence)
  }

  ask(sentence: Sentence): boolean {
    return this.knowledgeBase.ask(sentence)
  }

  makeActionQuery(): Sentence {
    return new Sentence()
  }
  
  makePerceptSentence(percept: Percept): Sentence {
    return new Sentence()
  }

  makeActionSentence(action: Action): Sentence {
    return new Sentence()
  }
}