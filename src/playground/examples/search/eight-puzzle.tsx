import * as React from 'react'
import * as _ from 'lodash'
import { Vector2 } from '@TRE/math'
import { SearchAlgorithms } from '@TRE/search'
import { EightPuzzleState, EightPuzzle } from '@TRE/search/problems/eight-puzzle'
import { Events } from '@TRE/core/events'
import { Panel } from './panel'

const { useState, useEffect, useCallback} = React

const NPuzzle: React.FC = () => {
  const gridLength = 50
  const size = 3
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
  const problem = new EightPuzzle(size, initial, goal)
  const [ solution, setSolution ] = useState([])
  const [ algoConfigs, setAlgoConfigs ] = useState({
    distance: 'manhattan',
    strategy: 'aStar',
    allowDiagonal: true,
    weight: 1,
  })

  const run = useCallback(() => {
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

    const result = SearchAlgorithms.bestFirstSearch(problem, h1)
    const solution = EightPuzzle.getSolution(result)
    setSolution(solution)
  }, [])

  const replay = useCallback(() => {
    setSolution([])
    run()
  }, [run])

  useEffect(() => {
    Events.removeAllListeners()

    Events.on('AI:Search:Configs', configs => {
      setAlgoConfigs({ ...algoConfigs, ...configs })
    })
    Events.on('AI:Search:Run', replay)
  }, [replay])

  console.log(initial.state.board)

  return (
    <>
      <div
        className="relative border border-black"
        style={{
          width: size * gridLength,
          height: size * gridLength,
        }}
      >
        {_.map(initial.state.board, (rowContent, row: number) => {
          return <>{_.map(initial.state.board[row], (number, col: number) => {
            console.log(col)
            return (
              <div
                className="absolute border border-black flex justify-center items-center text-2xl"
                style={{
                  top: row * gridLength,
                  left: col * gridLength,
                  width: gridLength,
                  height: gridLength,
                }}
              >
                { number !== '*' && number }
              </div>
            )
          })}</>
        })}
        
      </div>
    </>
  )
}

export default {
  description: '2d map search algorithms.',
  notCanvas: true,
  panel: Panel,
  run(app: any) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <NPuzzle />
      </div>
    )
  }
}
