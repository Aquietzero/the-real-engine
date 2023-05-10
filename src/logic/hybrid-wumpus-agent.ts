import * as _ from 'lodash'
import { KBAgent, Percept, Action } from './propositional-logic/kb-agent'
import { Sentence } from './propositional-logic/sentence'
import { Symbols, Axioms, Position } from './wumpus-world'

const {
  StenchT, BreezeT, GlitterT, BumpT, ScreamT,
  HaveArrowT,
} = Symbols

enum Actions {
  Grab = 'Grab',
  Climb = 'Climb',
}

export class HybridWumpusAgent extends KBAgent {
  plan: Action[] = []
  current: Position = [0, 0]

  constructor() {
    super()

    // set axioms about the wumpus world.
    this.setAxioms()
  }

  setAxioms() {
    // world axioms
    this.tell(Axioms.ThereAreBreezeAroundPits())
    this.tell(Axioms.ThereAreStenchAroundWumpus())
    this.tell(Axioms.ThereAreAtLeastOneWumpus())
    this.tell(Axioms.ThereAreAtMostOneWumpus())

    // initial state axioms
    // no wumpus at start, wumpus is alive
    this.tell(Sentence.NEGATE(new Sentence(Symbols.Wumpus(0, 0))))
    this.tell(new Sentence(Symbols.WumpusAliveT(0)))
    // no pit at start
    this.tell(Sentence.NEGATE(new Sentence(Symbols.Pit(0, 0))))
    // ok fluent at [0, 0] and t = 0
    this.tell(Axioms.FluentOK(0, 0, this.t))
  }

  run(percept: Percept): Action {
    this.tell(this.makePerceptSentence(percept))
    // tell the kb the temporal "physics" sentences for time t

    const safe = this.askKBForOKPositions()

    if (this.ask(new Sentence(GlitterT(this.t)))) {
      this.plan = [
        Actions.Grab,
        ...this.planRoute(this.current, [[0, 0]], safe),
        Actions.Climb
      ]
    }

    const unvisited = this.askKBForUnvisitedPositions()

    if (this.plan.length === 0) {
      this.plan = this.planRoute(this.current, _.intersection(unvisited, safe), safe)
    }

    if (this.plan.length === 0 && this.ask(new Sentence(HaveArrowT(this.t)))) {
      // get possible wumpus
      // plan shot
    }

    // no choice but to take a risk
    if (this.plan.length === 0) {
      const notUnsafe = this.askKBForNotUnsafePositions()
      this.plan = this.planRoute(this.current, _.intersection(unvisited, notUnsafe), safe)
    }

    // no choice but to take a risk
    if (this.plan.length === 0) {
      this.plan = [
        ...this.planRoute(this.current, [[0, 0]], safe),
        Actions.Climb
      ]
    }

    const action: Action = this.plan.shift()
    this.tell(this.makeActionSentence(action))

    this.t += 1
    return action
  }

  makePerceptSentence(percept: Percept): Sentence {
    const stench = new Sentence(StenchT(this.t))
    const breeze = new Sentence(BreezeT(this.t))
    const glitter = new Sentence(GlitterT(this.t))
    const bump = new Sentence(BumpT(this.t))
    const scream = new Sentence(ScreamT(this.t))

    return Sentence.EVERY([
      percept.stench ? stench : Sentence.NEGATE(stench),
      percept.breeze ? breeze : Sentence.NEGATE(breeze),
      percept.glitter ? glitter : Sentence.NEGATE(glitter),
      percept.bump ? bump : Sentence.NEGATE(bump),
      percept.scream ? scream : Sentence.NEGATE(scream),
    ]) 
  }

  askKBForOKPositions(): Position[] {
    return []
  }
  askKBForUnvisitedPositions(): Position[] {
    return []
  }
  askKBForNotUnsafePositions(): Position[] {
    return []
  }

  planRoute(current: Position, goals: Position[], allowed: Position[]): Action[] {
    return []
  }
}