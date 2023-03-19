import * as React from 'react'
import * as _ from 'lodash'
import cx from 'classnames'
import { Vector2 } from '@TRE/math'
import { bestFirstSearch } from '@TRE/search'
import { MapSearch2DState, MapSearch2D } from '@TRE/search/problems/map-2d'

const Map2D: React.FC = () => {
  const width = 30
  const height = 30
  const initial = new MapSearch2DState({ state: new Vector2(2, 2) })
  const goal = new MapSearch2DState({ state: new Vector2(20, 17) })
  const problem = new MapSearch2D(width, height, initial, goal)
  const f = (node: MapSearch2DState): number => {
    return node.state.manhattanDistance2(goal.state)
  }
  const result = bestFirstSearch(problem, f)
  const solution = MapSearch2D.getSolution(result)

  const getGridType = (row: number, col: number) => {
    if (row === initial.state.y && col === initial.state.x) return 'initial'
    if (row === goal.state.y && col === goal.state.x) return 'goal'

    const id = `${col}-${row}`
    if (_.includes(solution, id)) return 'solution'
    return 'normal'
  }

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
