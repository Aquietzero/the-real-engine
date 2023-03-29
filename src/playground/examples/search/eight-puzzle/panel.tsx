import * as _ from 'lodash'
import * as React from 'react'
import { Drawer, Radio, Space, Button, Switch, InputNumber } from 'antd'
import { Events } from '@TRE/core/events'

const { useState } = React

interface Props {}

const strategies = [{
  label: 'Search with H1',
  desc: 'Number of mismatched pairs',
  value: 'h1',
}, {
  label: 'Search with H2',
  desc: 'Sum of manhattan distance of mismatched pairs',
  value: 'h2',
}]

export const Panel: React.FC<Props> = (props: Props) => {
  const [strategy, setStrategy] = useState(strategies[0].value)

  return (
    <Drawer
      title="N Puzzle Solver"
      placement="right"
      visible={true}
      mask={false}
      closable={false}
    >
      <div className="my-2">
        <div className="mb-2 font-bold">Strategies</div>
        <Radio.Group
          onChange={e => {
            setStrategy(e.target.value)
            Events.emit('AI:Search:Configs', { strategy: e.target.value })
          }}
          value={strategy}
        >
          <Space direction="vertical">
            {_.map(strategies, strategy => {
              return (
                <Radio value={strategy.value}>
                  { strategy.label }
                  <div className="text-sm text-slate-500">{ strategy.desc }</div>
                </Radio>
              )
            })}
          </Space>
        </Radio.Group>
      </div>
      <div className="my-2">
        <Button className="mr-2" onClick={e => Events.emit('AI:Search:Shuffle')}>Shuffle</Button>
        <Button onClick={e => Events.emit('AI:Search:Solve')}>Solve</Button>
      </div>
    </Drawer>
  )
}
