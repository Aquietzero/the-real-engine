import { Model } from './propositional-logic/knowledge-base'

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

const isInside = (x: number, y: number): boolean => {
  return 0 <= x && x < map.length && 0 <= y && y < map[0].length
}

const up = (x: number, y: number) => {
  if (!isInside(x - 1, y)) return false
}

// returns true if there is a pit in [x, y]
export const Pit = (x: number, y: number) => {
  return {
    name: `Pit(${x}, ${y})`,
    eval: (model: Model) => model.map[x][y] === GRID.PIT
  }
}
// returns true if there is a wumpus in [x, y], dead or alive
export const Wumpus = (x: number, y: number) => {
  return {
    name: `Wumpus(${x}, ${y})`,
    eval: (model: Model) => model.map[x][y] === GRID.WUMPUS,
  }
}
// returns true if there is a breeze in [x, y]
export const Breeze = (x: number, y: number) => {
  return {
    name: `Breeze(${x}, ${y})`,
    eval: (model: Model) => {
      return (isInside(x - 1, y) && model.map[x - 1][y] === GRID.PIT)
        || (isInside(x + 1, y) && model.map[x + 1][y] === GRID.PIT)
        || (isInside(x, y - 1) && model.map[x][y - 1] === GRID.PIT)
        || (isInside(x, y + 1) && model.map[x][y + 1] === GRID.PIT)
    },
  }
}
// returns true if there is a stench in [x, y]
export const Stench = (x: number, y: number) => {
  return {
    name: `Stench(${x}, ${y})`,
    eval: (model: Model) => {
      return (isInside(x - 1, y) && model.map[x - 1][y] === GRID.WUMPUS)
        || (isInside(x + 1, y) && model.map[x + 1][y] === GRID.WUMPUS)
        || (isInside(x, y - 1) && model.map[x][y - 1] === GRID.WUMPUS)
        || (isInside(x, y + 1) && model.map[x][y + 1] === GRID.WUMPUS)
    },
  }
}
// returns true if the agent is in [x, y]
export const Location = (x: number, y: number) => {
  return {
    name: `Location(${x}, ${y})`,
    eval: (model: Model) => model.location.x === x && model.location.y === y,
  }
}
