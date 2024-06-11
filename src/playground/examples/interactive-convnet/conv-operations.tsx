import * as React from 'react'
import * as _ from 'lodash'
import { Events } from '@TRE/core/events'

type Matrix = number[][]
type GridType = 'result' | 'input' | 'kernel'

const relatedMap: { [key: string]: string[] } = {}
const relatedCalculation: { [key: string]: string[] } = {}
const gridIndex = (row: number, col: number) => `${row}-${col}`

const Grid = (grid: Matrix, gridType: GridType = 'result') => {
  const [resultGridIndex, setResultGridIndex] = React.useState('')
  // grid = [
  //   [1, 2, 3],
  //   [4, 5, 6]
  // ]
  const rows = grid.length
  const cols = grid[0].length
  const setRelated = (row: number, col: number) => {
    if (gridType !== 'result') return
    Events.emit('resultGridIndex', gridIndex(row, col))
  }
  const isRelated = React.useCallback((row: number, col: number) => {
    if (gridType !== 'input') return
    const index = gridIndex(row, col)
    return _.includes(relatedMap[resultGridIndex] || [], index)
  }, [resultGridIndex])

  React.useEffect(() => {
    Events.on('resultGridIndex', (gridIndex: string) => {
      // if (gridType !== 'input') return
      setResultGridIndex(gridIndex)
    })
  }, [])

  return (
    <>
      <div className="flex flex-col">
        {_.times(rows, (row) => {
          return (
            <div
              className="flex flex-row"
            >
              {_.times(cols, (col) => {
                return (
                  <div
                    id={`${row}-${col}`}
                    className="flex items-center justify-center border border-black border-solid -ml-px -mt-px"
                    style={{ width: 30, height: 30, background: isRelated(row, col) && 'red' }}
                    onMouseEnter={(e) => setRelated(row, col)}
                  >
                    { grid[row][col] }
                  </div>
                )
              })}
            </div>
          )
        })} 
      </div>
      {gridType === 'result' && (
        <div>
          {(relatedCalculation[resultGridIndex] || []).join(' + ')}
        </div>
      )}
    </>
  )
}

const convolution = (input: Matrix, kernel: Matrix, stride: number = 1): Matrix => {
  const rows = input.length
  const cols = input[0].length

  const kernelRows = kernel.length
  const kernelCols = kernel[0].length
  const rowOffset = Math.floor(kernelRows / 2)
  const colOffset = Math.floor(kernelCols / 2)

  const row = Math.floor(rowOffset)
  const col = Math.floor(colOffset)
  const maxRow = rows - Math.floor(kernelRows / 2)
  const maxCol = cols - Math.floor(kernelCols / 2)

  const result: Matrix = []

  for (let r = row; r < maxRow; ++r) {
    result.push([])
    for (let c = col; c < maxCol; ++c) {
      let sum = 0
      relatedMap[gridIndex(r - row, c - col)] = []
      relatedCalculation[gridIndex(r - row, c - col)] = []
      for (let i = 0; i < kernelRows; ++i) {
        for (let j = 0; j < kernelCols; ++j) {
          sum += kernel[i][j] * input[r - rowOffset + i][c - colOffset + j]
          relatedMap[gridIndex(r - row, c - col)].push(
            gridIndex(r - rowOffset + i, c - colOffset + j)
          )
          relatedCalculation[gridIndex(r - row, c - col)].push(
            `${kernel[i][j]} x ${input[r - rowOffset + i][c - colOffset + j]}`
          )
        }
      }
      result[r - row].push(sum)
    }
  }

  return result
}

const ConvOperations: React.FC = () => {
  const width = 40
  const height = 40

  const input: Matrix = [
    [1, 2, 8, 4, 5],
    [6, 7, 8, 7, 1],
    [3, 7, 4, 9, 2],
    [6, 2, 3, 2, 9],
    [6, 7, 1, 9, 6],
  ]

  const kernel: Matrix = [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ]

  return <div>
    {Grid(input, 'input')}
    <br />
    {Grid(kernel, 'kernel')}
    <br />
    {Grid(convolution(input, kernel), 'result')}
  </div>
}

export default {
  description: 'convolutional operations.',
  notCanvas: true,
  // panel: Panel,
  run(app: any) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <ConvOperations />
      </div>
    )
  }
}
