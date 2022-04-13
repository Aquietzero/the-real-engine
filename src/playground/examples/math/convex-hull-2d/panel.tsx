import * as React from 'react'
import { Divider, Drawer } from 'antd'
import { CloseOutlined, CheckOutlined } from '@ant-design/icons'
import { Events } from '@TRE/core/events'
import { SliderInput } from '@TRE/playground/components/slider-input'
import { Checkbox } from 'antd'

const { useState, useEffect } = React

interface Props {}

export const Panel: React.FC<Props> = (props: Props) => {
  const [num, setNum] = useState(20)
  const [range, setRange] = useState(3)
  const [showPoints, setShowPoints] = useState(true)

  return (
    <Drawer
      title="2D 凸包生成器"
      placement="right"
      visible={true}
      mask={false}
      closable={false}
    >
      <SliderInput
        label="点数"
        min={4}
        max={100}
        step={1}
        value={num}
        setValue={(n: number) => {
          setNum(n)
          Events.emit('ConvexHull2DExample:numOfPoints', n)
        }}
      />
      <SliderInput
        label="半径"
        min={1}
        max={6}
        step={0.1}
        value={range}
        setValue={(r: number) => {
          setRange(r)
          Events.emit('ConvexHull2DExample:range', r)
        }}
      />
      <div className="py-1">
        <Checkbox
          checked={showPoints}
          onChange={(e: any) => {
            setShowPoints(e.target.checked)
            Events.emit('ConvexHull2DExample:showPoints', e.target.checked)
          }}
        >show random points</Checkbox>
      </div>
    </Drawer>
  )
}
