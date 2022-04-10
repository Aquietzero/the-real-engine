import * as React from 'react'
import { Slider, InputNumber, Row, Col } from 'antd'

interface SliderInputProps {
  label: string
  scale: number
  setScale: any
  min?: number
  max?: number
}

export const SliderInput: React.FC<SliderInputProps> = (props: SliderInputProps) => {
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

