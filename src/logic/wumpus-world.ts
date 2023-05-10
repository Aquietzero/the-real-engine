import * as _ from 'lodash'
import { Sentence } from "./propositional-logic/sentence"

export enum GRID {
  PIT,
  WUMPUS,
  GOLD,
  EMPTY, 
}

export const map = [
  [GRID.EMPTY, GRID.EMPTY, GRID.EMPTY, GRID.PIT],
  [GRID.WUMPUS, GRID.GOLD, GRID.PIT, GRID.EMPTY],
  [GRID.EMPTY, GRID.EMPTY, GRID.EMPTY, GRID.EMPTY],
  [GRID.EMPTY, GRID.EMPTY, GRID.PIT, GRID.PIT],
]

export const MAP_ROWS = map.length
export const MAP_COLS = map[0].length

export type Position = [number, number]

const isInsideMap = (position: Position): boolean => {
  const [row, col] = position
  return 0 <= row && row < MAP_ROWS && 0 <= col && col < MAP_COLS
}

const getNeighborGrids = (position: Position): Position[] => {
  const [row, col] = position
  return _.compact([
    isInsideMap([row - 1, col]) && [row - 1, col],
    isInsideMap([row + 1, col]) && [row + 1, col],
    isInsideMap([row, col - 1]) && [row, col - 1],
    isInsideMap([row, col + 1]) && [row, col + 1],
  ])
}

export const Symbols = {
  // atemporal symbols
  Pit: (x: number, y: number) => `Pit(${x}, ${y})`,
  Wumpus: (x: number, y: number) => `Wumpus(${x}, ${y})`,
  Breeze: (x: number, y: number) => `Breeze(${x}, ${y})`,
  Stench: (x: number, y: number) => `Stench(${x}, ${y})`,
  Location: (x: number, y: number, t: number) => `Location_${t}(${x}, ${y})`,
  
  // fluent symbols
  OK: (x: number, y: number, t: number) => `OK_${t}(${x}, ${y})`,
  
  StenchT: (t: number) => `Stench_${t}`,
  BreezeT: (t: number) => `Breeze_${t}`,
  GlitterT: (t: number) => `Glitter_${t}`,
  BumpT: (t: number) => `Bump_${t}`,
  ScreamT: (t: number) => `Scream_${t}`,
  HaveArrowT: (t: number) => `HaveArrow_${t}`,
  WumpusAliveT: (t: number) => `WumpusAlive_${t}`,
}

export const Axioms = {
  // breeze around pits.
  ThereAreBreezeAroundPits(): Sentence {
    const breezeClauses = []
    for (let row = 0; row < MAP_ROWS; row++) {
      for (let col = 0; col < MAP_COLS; col++) {
        const neighbors = getNeighborGrids([row, col])
        const pits = _.map(neighbors, ([r, c]) => {
          return new Sentence(Symbols.Pit(r, c))
        })
        breezeClauses.push(Sentence.IFF(
          new Sentence(Symbols.Breeze(row, col)),
          Sentence.SOME(pits)
        ))
      }
    }
    // console.log(_.map(breezeClauses, c => c.print()))
    return Sentence.EVERY(breezeClauses)
  },

  // stench around wumpus.
  ThereAreStenchAroundWumpus(): Sentence {
    const stenchClauses = []
    for (let row = 0; row < MAP_ROWS; row++) {
      for (let col = 0; col < MAP_COLS; col++) {
        const neighbors = getNeighborGrids([row, col])
        const wumpus = _.map(neighbors, ([r, c]) => {
          return new Sentence(Symbols.Pit(r, c))
        })
        stenchClauses.push(Sentence.IFF(
          new Sentence(Symbols.Stench(row, col)),
          Sentence.SOME(wumpus)
        ))
      }
    }
    // console.log(_.map(stenchClauses, c => c.print()))
    return Sentence.EVERY(stenchClauses)
  },

  // at least one wumpus.
  ThereAreAtLeastOneWumpus(): Sentence {
    const wumpusClauses = []
    for (let row = 0; row < MAP_ROWS; row++) {
      for (let col = 0; col < MAP_COLS; col++) {
        wumpusClauses.push(new Sentence(Symbols.Wumpus(row, col)))
      }
    }
    // console.log(_.map(wumpusClauses, c => c.print()))
    return Sentence.SOME(wumpusClauses)
  },

  // at most one wumpus.
  ThereAreAtMostOneWumpus() {
    const grids = []
    for (let row = 0; row < MAP_ROWS; row++) {
      for (let col = 0; col < MAP_COLS; col++) {
        grids.push([row, col])
      }
    }

    const wumpusFreeClauses = []
    for (let i = 0; i < grids.length - 1; i++) {
      const [g1Row, g1Col] = grids[i]
      for (let j = i + 1; j < grids.length; j++) {
        const [g2Row, g2Col] = grids[j]
        wumpusFreeClauses.push(Sentence.OR(
          new Sentence(Symbols.Wumpus(g1Row, g1Col)),
          new Sentence(Symbols.Wumpus(g2Row, g2Col))
        ))
      }
    }

    // console.log(_.map(wumpusFreeClauses, c => c.print()))
    return Sentence.EVERY(wumpusFreeClauses)
  },

  FluentOK(x: number, y: number, t: number): Sentence {
    return Sentence.IFF(
      new Sentence(Symbols.OK(x, y, t)),
      Sentence.AND(
        Sentence.NEGATE(new Sentence(Symbols.Pit(x, y))),
        Sentence.NEGATE(
          Sentence.AND(
            new Sentence(Symbols.Wumpus(x, y)),
            new Sentence(Symbols.WumpusAliveT(t)),
          )
        )
      )
    )
  }
}