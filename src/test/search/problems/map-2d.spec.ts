import * as _ from 'lodash'
import { expect } from 'chai'
import { bestFirstSearch } from '@TRE/search'
import { Vector2 } from '@TRE/math/vector2'
import { MapSearch2D, MapSearch2DState } from '@TRE/search/problems/map-2d'

describe('Search', () => {
  describe('#bestFirst', () => {
    const initial = new MapSearch2DState({ state: new Vector2(2, 2) })
    const goal = new MapSearch2DState({ state: new Vector2(4, 2) })
    const problem = new MapSearch2D(5, 5, initial, goal)
    const f = (node: MapSearch2DState): number => {
      return node.state.manhattanDistance2(goal.state)
    }
    const result = bestFirstSearch(problem, f)
    const solution = MapSearch2D.getSolution(result)
    expect(solution).to.deep.equal(['2-2', '3-2', '4-2'])
  })
})