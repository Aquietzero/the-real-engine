import * as React from 'react'
import cx from 'classnames'
import * as Key from 'keymaster'

interface Props {
  id: string
  type: string
  barrier: any
  setBarrier: any
}

const G: React.FC<Props> = (props: Props) => {
  const { id, type, barrier, setBarrier } = props

  return (
    <div
      className={cx(
        'flex flex-row',
        type === 'initial' && 'bg-red-500',
        type === 'goal' && 'bg-green-500',
        type === 'solution' && 'bg-blue-500',
        type === 'reached' && 'bg-slate-200',
        type === 'frontier' && 'bg-slate-300',
        type === 'barrier' && 'bg-black',
      )}
      style={{
        width: 20,
        height: 20,
        margin: '-1px 0 0 -1px',
        border: 'solid 1px black',
      }}
      onMouseEnter={e => {
        if (!Key.isPressed('b')) return

        if (barrier[id]) delete barrier[id]
        else barrier[id] = true
        setBarrier({ ...barrier })
      }}
    />
  )
}

export const Grid = React.memo(G)
