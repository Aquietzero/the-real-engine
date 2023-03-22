import * as _ from 'lodash'
import { expect } from 'chai'
import { SearchAlgorithms } from '@TRE/search'
import { Vector2 } from '@TRE/math/vector2'
import { EightPuzzle, EightPuzzleState } from '@TRE/search/problems/eight-puzzle'

describe('Search', () => {
  // describe('#bestFirst', () => {
  //   const initial = new EightPuzzleState({
  //     state: {
  //       board: [
  //         ['1', '*', '2'],
  //         ['3', '4', '5'],
  //         ['6', '7', '8'],
  //       ],
  //       slot: new Vector2(0, 1)
  //     }
  //   })
  //   const goal = new EightPuzzleState({
  //     state: {
  //       board: [
  //         ['*', '1', '2'],
  //         ['3', '4', '5'],
  //         ['6', '7', '8'],
  //       ],
  //       slot: new Vector2(0, 0)
  //     }
  //   })
  //   const problem = new EightPuzzle(3, initial, goal)
  //   const f = (node: EightPuzzleState): number => {
  //     const current = _.flatten(node.state.board)
  //     const target = _.flatten(goal.state.board)
  //     let dist = 0
  //     _.each(current, (number, currentIndex) => {
  //       const targetIndex = _.findIndex(target, number)
  //       if (currentIndex !== targetIndex) {
  //         dist += 1
  //       }
  //     })
  //     return dist
  //   }
  //   const result = SearchAlgorithms.bestFirstSearch(problem, f)
  //   const solution = EightPuzzle.getSolution(result)
  //   expect(solution).to.deep.equal(['1*2345678', '*12345678'])
  // })

  describe('#bestFirst', () => {
    const initial = new EightPuzzleState({
      state: {
        board: [
          ['1', '2', '3'],
          ['4', '*', '5'],
          ['6', '7', '8'],
        ],
        slot: new Vector2(1, 1)
      }
    })
    const goal = new EightPuzzleState({
      state: {
        board: [
          ['*', '1', '2'],
          ['3', '4', '5'],
          ['6', '7', '8'],
        ],
        slot: new Vector2(0, 0)
      }
    })
    const size = 3
    const problem = new EightPuzzle(size, initial, goal)
    const h1 = (node: EightPuzzleState): number => {
      const current = _.flatten(node.state.board)
      const target = _.flatten(goal.state.board)
      let dist = 0
      _.each(current, (number, currentIndex) => {
        const targetIndex = _.findIndex(target, number)
        if (currentIndex !== targetIndex) {
          dist += 1
        }
      })
      return dist
    }
    const h2 = (node: EightPuzzleState): number => {
      const current = _.flatten(node.state.board)
      const target = _.flatten(goal.state.board)
      let dist = 0
      _.each(current, (number, currentIndex) => {
        const targetIndex = _.findIndex(target, number)
        const diff = currentIndex - targetIndex
        const rowDiff = diff % size
        const colDiff = diff  - rowDiff * size
        dist = rowDiff + colDiff
      })
      return dist
    }

    problem.shuffle(10)
    console.log(problem.initial.state.board)
    const result = SearchAlgorithms.bestFirstSearch(problem, h1)
    const solution = EightPuzzle.getSolution(result)
    console.log(solution)
    // expect(solution).to.deep.equal(['1*2345678', '*12345678'])
  })
})