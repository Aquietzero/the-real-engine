import * as React from 'react'
import { Divider, Drawer } from 'antd'
import { Events } from '@TRE/core/events'
import { SliderInput } from '@TRE/playground/components/slider-input'

const { useState } = React

interface Props {}

export const Panel: React.FC<Props> = (props: Props) => {
  const [translates, setTranslates] = useState({ x: 0, y: 0, z: 0 })
  const [rotates, setRotates] = useState({ x: 0, y: 0, z: 0 })

  const setTranslate = (d: 'x' | 'y' | 'z') => {
    return (value: number) => {
      const dt = { ...{ x: 0, y: 0, z: 0 }, [d]: value - translates[d] }
      setTranslates({ ...translates, [d]: value })
      Events.emit('translate', dt)
    }
  }

  const setRotate = (d: 'x' | 'y' | 'z') => {
    return (value: number) => {
      const dt = { ...{ x: 0, y: 0, z: 0 }, [d]: value - rotates[d] }
      setRotates({ ...rotates, [d]: value })
      Events.emit('rotate', dt)
    }
  }

  return (
    <Drawer
      title="GJK 算法"
      placement="right"
      visible={true}
      mask={false}
      closable={false}
    >
      <div>移动蓝色多面体，当其与黑色多面体发生碰撞的时候，会变成红色，可以充分旋转来观察碰撞边缘是否准确。</div>
      <Divider orientation="left">平移</Divider>
      <SliderInput label="x 轴" min={-10} value={translates.x} setValue={setTranslate('x')} />
      <SliderInput label="y 轴" min={-10} value={translates.y} setValue={setTranslate('y')} />
      <SliderInput label="z 轴" min={-10} value={translates.z} setValue={setTranslate('z')} />

      <Divider orientation="left">旋转</Divider>
      <SliderInput label="x 轴" min={0} value={rotates.x} setValue={setRotate('x')} />
      <SliderInput label="y 轴" min={0} value={rotates.y} setValue={setRotate('y')} />
      <SliderInput label="z 轴" min={0} value={rotates.z} setValue={setRotate('z')} />
    </Drawer>
  )
}
