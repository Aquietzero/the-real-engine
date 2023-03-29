import * as React from 'react'
import * as _ from 'lodash'
import { Vector2 } from '@TRE/math'
import { SearchAlgorithms } from '@TRE/search'
import { MapSearch2DState, MapSearch2D } from '@TRE/search/problems/map-2d'
import { Events } from '@TRE/core/events'
import { Panel } from './panel'
import { Grid } from './grid'

const { useState, useEffect, useCallback, memo} = React

const distanceFunctions = {
  manhattan: 'manhattanDistance2',
  euclidean: 'euclideanDistance2',
}

const Map2D: React.FC = () => {
  const width = 40
  const height = 40
  const initial = new MapSearch2DState({ state: new Vector2(2, 2) })
  const goal = new MapSearch2DState({ state: new Vector2(30, 20) })
  const problem = new MapSearch2D(width, height, initial, goal)
  const [ frontier, setFrontier ] = useState()
  const [ reached, setReached ] = useState()
  const [ solution, setSolution ] = useState([])
  const [ barrier, setBarrier ] = useState({} as any)
  const [ algoConfigs, setAlgoConfigs ] = useState({
    distance: 'manhattan',
    strategy: 'aStar',
    allowDiagonal: true,
    weight: 1,
  })

  const getGridType = (row: number, col: number) => {
    if (row === initial.state.y && col === initial.state.x) return 'initial'
    if (row === goal.state.y && col === goal.state.x) return 'goal'

    const id = `${col}-${row}`
    if (barrier[id]) return 'barrier'
    if (_.includes(solution, id)) return 'solution'
    if (frontier && _.find((frontier as any).nodes || [], { id })) return 'frontier'
    if (reached && reached[id]) return 'reached'
    return 'normal'
  }

  const genAlgo = useCallback(() => {
    let algo
    const distFunc = (distanceFunctions as any)[algoConfigs.distance]
    switch (algoConfigs.strategy) {
      case 'aStar':
        algo = (node: MapSearch2DState): number => {
          return node.state[distFunc](initial.state) +
            algoConfigs.weight * node.state[distFunc](goal.state)
        }
      break
      case 'dijkstras':
        algo = (node: MapSearch2DState): number => {
          return node.state[distFunc](initial.state)
        }
      break
      case 'bestFirst':
        algo = (node: MapSearch2DState): number => {
          return node.state[distFunc](goal.state)
        }
      break
      case 'breadthFirst':
        algo = (node: MapSearch2DState): number => {
          return 0
        }
      break
    }
    return algo
  }, [algoConfigs])

  const run = useCallback(() => {
    const algo = genAlgo()

    problem.setBarrier(barrier)
    problem.setAllowDiagonal(algoConfigs.allowDiagonal)
    const gen = SearchAlgorithms.bestFirstSearchGenerator(problem, algo)
    const timerId = setInterval(() => {
      const next = gen.next()
      if (next.done) {
        const result = SearchAlgorithms.bestFirstSearch(problem, algo)
        const solution = MapSearch2D.getSolution(result)
        setSolution(solution)
        clearInterval(timerId)
        return
      }

      const { frontier: f, reached: r } = next.value as any
      setFrontier({ ...f })
      setReached({ ...r })
    })
  }, [barrier, genAlgo])

  const replay = useCallback(() => {
    setFrontier(null)
    setReached(null)
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


  return <>
    {_.times(height, row => {
      return (
        <div className="flex flex-col">
          {_.times(width, col => {
            const type = getGridType(row, col)
            const id = `${col}-${row}`
            return <Grid id={id} type={type} barrier={barrier} setBarrier={setBarrier} />
          })}
        </div>
      )
    })}
  </>
}

export default {
  description: '2d map search algorithms.',
  notCanvas: true,
  panel: Panel,
  run(app: any) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Map2D />
      </div>
    )
  }
}
