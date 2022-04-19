import * as React from 'react'
import { Divider, Drawer } from 'antd'
import { Events } from '@TRE/core/events'
import { SliderInput } from '@TRE/playground/components/slider-input'

const { useState } = React

interface Props {}

export const Panel: React.FC<Props> = (props: Props) => {
  const [dir, setDir] = useState({ x: 0, y: 0, z: 5 })

  const setDirVector = (d: 'x' | 'y' | 'z') => {
    return (value: number) => {
      const newDir = { ...dir, [d]: value }
      setDir(newDir)
      Events.emit('dir', newDir)
    }
  }

  return (
    <Drawer
      title="方向设置"
      placement="right"
      visible={true}
      mask={false}
      closable={false}
    >
      <Divider orientation="left">方向向量</Divider>
      <SliderInput label="x 轴" min={-5} max={5} value={dir.x} setValue={setDirVector('x')} />
      <SliderInput label="y 轴" min={-5} max={5} value={dir.y} setValue={setDirVector('y')} />
      <SliderInput label="z 轴" min={-5} max={5} value={dir.z} setValue={setDirVector('z')} />
    </Drawer>
  )
}
