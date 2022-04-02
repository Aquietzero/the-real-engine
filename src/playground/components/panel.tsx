import * as React from 'react'
import { Slider, InputNumber, Row, Col, Divider, Drawer } from 'antd'
import { LockOutlined, UnlockOutlined } from '@ant-design/icons'
import { Events } from '@TRE/core/events'

interface Props {
}

const { useEffect, useState } = React

interface SliderInputProps {
  label: string
  scale: number
  setScale: any
  min?: number
  max?: number
}

const SliderInput: React.FC<SliderInputProps> = (props: SliderInputProps) => {
  const { label, scale, setScale, min = 1, max = 10 } = props

  return (
    <Row className="flex items-center">
      <Col span={3}>
        { label }
      </Col>
      <Col span={14}>
        <Slider
          min={min}
          max={max}
          step={0.01}
          onChange={setScale}
          value={scale}
        />
      </Col>
      <Col span={7}>
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
  const [lockScaleRatio, setLockScaleRatio] = useState(false)

  const setScale = (d: 'x' | 'y' | 'z') => {
    return (value: number) => {
      const ratio = value / scales[d]
      const diffs = lockScaleRatio ? {
        x: ratio, y: ratio, z: ratio,
      } : { [d]: ratio }
      const values = lockScaleRatio ? {
        x: scales.x * ratio, y: scales.y * ratio, z: scales.z * ratio
      } : { [d]: value }
      const ds = { ...{ x: 1, y: 1, z: 1 }, ...diffs }
      setScales({ ...scales, ...values })
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

  const toggleLockScaleRatio = () => {
    setLockScaleRatio(!lockScaleRatio)
  }

  return (
    <Drawer
      title="编辑器"
      placement="right"
      visible={true}
      mask={false}
      closable={false}
    >
      <Divider
        orientation="left"
        children={
          <div className="flex items-center">
            <span className="mr-1">缩放</span>
            {lockScaleRatio ? (
              <LockOutlined
                className="text-blue-500"
                onClick={toggleLockScaleRatio}
              />
            ) : (
              <UnlockOutlined
                onClick={toggleLockScaleRatio}
              />
            )}
          </div>
        }
      />
      <SliderInput label="x 轴" scale={scales.x} setScale={setScale('x')} />
      <SliderInput label="y 轴" scale={scales.y} setScale={setScale('y')} />
      <SliderInput label="z 轴" scale={scales.z} setScale={setScale('z')} />

      <Divider orientation="left">平移</Divider>
      <SliderInput label="x 轴" min={-10} scale={translates.x} setScale={setTranslate('x')} />
      <SliderInput label="y 轴" min={-10} scale={translates.y} setScale={setTranslate('y')} />
      <SliderInput label="z 轴" min={-10} scale={translates.z} setScale={setTranslate('z')} />

      <Divider orientation="left">旋转</Divider>
      <SliderInput label="x 轴" min={0} scale={rotates.x} setScale={setRotate('x')} />
      <SliderInput label="y 轴" min={0} scale={rotates.y} setScale={setRotate('y')} />
      <SliderInput label="z 轴" min={0} scale={rotates.z} setScale={setRotate('z')} />
    </Drawer>
  )
}
