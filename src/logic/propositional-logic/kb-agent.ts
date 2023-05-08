import { KnowledgeBase, Sentence } from "./knowledge-base"

type Percept = any
type Action = any

export class KBAgent {
  knowledgeBase: KnowledgeBase = new KnowledgeBase()
  t: number = 0

  run(percept: Percept): Action {
    this.tell(this.makePerceptSentence(percept))
    const action: Action = this.ask(this.makeActionQuery())
    this.tell(this.makeActionSentence(action))
    this.t += 1
    return action
  }

  tell(sentence: Sentence) {

  }

  ask(sentence: Sentence) {

  }

  makeActionQuery(): Sentence {
  }
  
  makePerceptSentence(percept: Percept): Sentence {
  }

  makeActionSentence(action: Action): Sentence {
  }
}