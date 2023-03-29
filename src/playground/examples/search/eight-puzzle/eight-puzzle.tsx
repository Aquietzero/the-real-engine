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
  const margin = 2
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
  const [ board, setBoard ] = useState(initial.state.board)
  const [ solution, setSolution ] = useState([])
  const [ algoConfigs, setAlgoConfigs ] = useState({
    strategy: 'h1',
  })

  // number of mismatched pairs
  const target = _.flatten(goal.state.board)
  const h1 = (node: EightPuzzleState): number => {
    const current = _.flatten(node.state.board)
    let dist = 0
    _.each(current, (number, currentIndex) => {
      const targetIndex = _.findIndex(target, number)
      if (currentIndex !== targetIndex) {
        dist += 1
      }
    })
    return dist
  }

  // sum of manhattan distance of mismatch pairs
  const h2 = (node: EightPuzzleState): number => {
    const current = _.flatten(node.state.board)
    let dist = 0
    _.each(current, (number, currentIndex) => {
      const targetIndex = _.findIndex(target, number)
      const currRow = currentIndex % size
      const currCol = currentIndex - currRow * size
      const targetRow = targetIndex % size
      const targetCol = targetIndex - targetRow * size
      dist += Math.abs(currRow - targetRow) + Math.abs(currCol - targetCol)
    })
    return dist
  }

  const run = useCallback(() => {
    const algo = algoConfigs.strategy === 'h1' ? 'h1' : 'h2'
    console.log(algoConfigs, '-----------')
    const result = SearchAlgorithms.bestFirstSearch(problem, algo)
    const solution = EightPuzzle.getSolution(result, (node) => node.state.board)
    console.log('solution', solution)
    let idx = 0
    const timer = setInterval(() => {
      if (!solution[idx]) {
        clearInterval(timer)
        return
      }
      setBoard(solution[idx])
      idx += 1
    }, 500)
    // setSolution(solution)
  }, [problem, algoConfigs])

  const replay = useCallback(() => {
    setSolution([])
    run()
  }, [run])

  useEffect(() => {
    Events.removeAllListeners()

    Events.on('AI:Search:Configs', configs => {
      setAlgoConfigs({ ...algoConfigs, ...configs })
    })
    Events.on('AI:Search:Solve', replay)
    Events.on('AI:Search:Shuffle', () => {
      problem.shuffle(10)
      setBoard(problem.initial.state.board)
    })
  }, [replay])

  return (
    <>
      <div
        className="relative border border-black"
        style={{
          width: size * (gridLength + margin) + 2 * margin,
          height: size * (gridLength + margin) + 2 * margin,
        }}
      >
        {_.map(board, (rowContent, row: number) => {
          return <>{_.map(board[row], (number, col: number) => {
            return number !== '*' && (
              <div
                key={number}
                className="absolute border border-black flex justify-center items-center text-2xl"
                style={{
                  top: margin,
                  left: margin,
                  transform: `translate(${col * (gridLength + margin)}px, ${row * (gridLength + margin)}px)`,
                  width: gridLength,
                  height: gridLength,
                  transition: 'transform 0.2s ease',
                }}
              >
                { number }
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
