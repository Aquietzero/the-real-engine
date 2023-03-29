import * as _ from 'lodash'
import * as React from 'react'
import { Drawer, Radio, Space, Button, Switch, InputNumber } from 'antd'
import { Events } from '@TRE/core/events'

const { useState, useEffect } = React

interface Props {}

const distanceFunctions = [{
  label: 'Manhattan',
  value: 'manhattan',
}, {
  label: 'Euclidean',
  value: 'euclidean',
}]

const strategies = [{
  label: 'A* Search',
  desc: '[ f = g + W x h ]',
  value: 'aStar',
}, {
  label: 'Best First Search',
  desc: '[ f = h ]',
  value: 'bestFirst',
}, {
  label: 'Dijkstra\'s Search',
  desc: '[ f = g ]',
  value: 'dijkstras',
}, {
  label: 'Breadth First Search',
  desc: '[ f = 0 ]',
  value: 'breadthFirst',
}]

export const Panel: React.FC<Props> = (props: Props) => {
  const [distance, setDistance] = useState(distanceFunctions[0].value)
  const [strategy, setStrategy] = useState(strategies[0].value)
  const [allowDiagonal, setAllowDiagonal] = useState(true)
  const [weight, setWeight] = useState(1)

  return (
    <Drawer
      title="2D Map Search"
      placement="right"
      visible={true}
      mask={false}
      closable={false}
    >
      <div className="my-2">
        <div className="mb-2 font-bold">Allow Diagonal</div>
        <Switch
          checked={allowDiagonal}
          onChange={checked => {
            setAllowDiagonal(checked)
            Events.emit('AI:Search:Configs', { allowDiagonal: checked })
          }}
        />
      </div>
      <div className="my-2">
        <div className="mb-2 font-bold">Distance</div>
        <Radio.Group
          onChange={e => {
            setDistance(e.target.value)
            Events.emit('AI:Search:Configs', { distance: e.target.value })
          }}
          value={distance}
        >
          <Space direction="vertical">
            {_.map(distanceFunctions, distanceFunc => {
              return <Radio value={distanceFunc.value}>{ distanceFunc.label }</Radio>
            })}
          </Space>
        </Radio.Group>
      </div>
      <div className="my-2">
        <div className="mb-2 font-bold">Strategies</div>
        <div className="mb-2 text-slate-500">
          <div>f: the evaluation function</div>
          <div>g: the cost from initial to current node</div>
          <div>h: the cost from current node to goal</div>
        </div>
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
        {strategy === 'aStar' && (
          <div className="my-2">
            <div className="mb-2 font-bold">Weight</div>
            <InputNumber
              min={1}
              max={10}
              value={weight}
              onChange={value => {
                setWeight(value)
                Events.emit('AI:Search:Configs', { weight: value })
              }}
            />
          </div>
        )}
      </div>
      <div className="my-2">
        <Button onClick={e => Events.emit('AI:Search:Run')}>Run</Button>
      </div>
    </Drawer>
  )
}
