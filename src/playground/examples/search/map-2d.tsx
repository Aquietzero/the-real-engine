import * as React from 'react'
import * as _ from 'lodash'
import cx from 'classnames'
import { Vector2 } from '@TRE/math'
import { bestFirstSearch, bestFirstSearchGenerator } from '@TRE/search'
import { MapSearch2DState, MapSearch2D } from '@TRE/search/problems/map-2d'

const { useState, useLayoutEffect } = React

const Map2D: React.FC = () => {
  const width = 30
  const height = 30
  const initial = new MapSearch2DState({ state: new Vector2(2, 2) })
  const goal = new MapSearch2DState({ state: new Vector2(20, 17) })
  const problem = new MapSearch2D(width, height, initial, goal)
  const distFunc = (node: MapSearch2DState): number => {
    return node.state.euclideanDistance2(goal.state)
  }
  const [ frontier, setFrontier ] = useState()
  const [ reached, setReached ] = useState()
  const [ solution, setSolution ] = useState([])

  const getGridType = (row: number, col: number) => {
    if (row === initial.state.y && col === initial.state.x) return 'initial'
    if (row === goal.state.y && col === goal.state.x) return 'goal'

    const id = `${col}-${row}`
    if (_.includes(solution, id)) return 'solution'
    if (frontier && _.find((frontier as any).nodes || [], { id })) return 'frontier'
    if (reached && reached[id]) return 'reached'
    return 'normal'
  }

  useLayoutEffect(() => {
    const gen = bestFirstSearchGenerator(problem, distFunc)
    setInterval(() => {
      const next = gen.next()
      if (next.done) {
        const result = bestFirstSearch(problem, distFunc)
        const solution = MapSearch2D.getSolution(result)
        setSolution(solution)
        return
      }

      const { frontier: f, reached: r } = next.value as any
      setFrontier({ ...f })
      setReached({ ...r })
    }, 10)
  }, [])

  return <>
    {_.times(height, row => {
      return (
        <div className="flex flex-col">
          {_.times(width, col => {
            const type = getGridType(row, col)
            return (
              <div
                className={cx(
                  'flex flex-row',
                  type === 'initial' && 'bg-red-500',
                  type === 'goal' && 'bg-green-500',
                  type === 'solution' && 'bg-blue-500',
                  type === 'reached' && 'bg-slate-200',
                  type === 'frontier' && 'bg-slate-300',
                )}
                style={{
                  width: 20,
                  height: 20,
                  margin: '-1px 0 0 -1px',
                  border: 'solid 1px black',
                }}
              />
            )
          })}
        </div>
      )
    })}
  </>
}

export default {
  description: '2d map search algorithms.',
  notCanvas: true,
  run(app: any) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Map2D />
      </div>
    )
  }
}
