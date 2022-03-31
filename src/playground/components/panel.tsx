import * as React from 'react'
import * as _ from 'lodash'
import { Slider, InputNumber, Row, Col } from 'antd'
import { Events } from '@TRE/core/events'

interface Props {
}

const { useEffect, useState } = React

interface SliderInputProps {
  scale: number
  setScale: any
  min?: number
  max?: number
}

const SliderInput: React.FC<SliderInputProps> = (props: SliderInputProps) => {
  const { scale, setScale, min = 1, max = 10 } = props

  return (
    <Row>
      <Col span={16}>
        <Slider
          min={min}
          max={max}
          step={0.01}
          onChange={setScale}
          value={scale}
        />
      </Col>
      <Col span={8}>
        <InputNumber
          min={min}
          max={max}
          step={0.01}
          style={{ margin: '0 16px' }}
          value={scale}
          onChange={setScale}
        />
      </Col>
    </Row>
  )
}

export const Panel: React.FC<Props> = (props: Props) => {
  const [scales, setScales] = useState({ x: 1, y: 1, z: 1 })
  const [translates, setTranslates] = useState({ x: 0, y: 0, z: 0 })
  const [rotates, setRotates] = useState({ x: 0, y: 0, z: 0 })

  const setScale = (d: 'x' | 'y' | 'z') => {
    return (value: number) => {
      const ds = { ...{ x: 1, y: 1, z: 1 }, [d]: value / scales[d] }
      setScales({ ...scales, [d]: value })
      Events.emit('scale', ds)
    }
  }

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
    <div
      style={{ width: 350 }}
      className="fixed h-full right-0 top-0 p-5"
    >
      <SliderInput scale={scales.x} setScale={setScale('x')} />
      <SliderInput scale={scales.y} setScale={setScale('y')} />
      <SliderInput scale={scales.z} setScale={setScale('z')} />

      <SliderInput min={0} scale={translates.x} setScale={setTranslate('x')} />
      <SliderInput min={0} scale={translates.y} setScale={setTranslate('y')} />
      <SliderInput min={0} scale={translates.z} setScale={setTranslate('z')} />

      <SliderInput min={0} scale={rotates.x} setScale={setRotate('x')} />
      <SliderInput min={0} scale={rotates.y} setScale={setRotate('y')} />
      <SliderInput min={0} scale={rotates.z} setScale={setRotate('z')} />
    </div>
  )
}
