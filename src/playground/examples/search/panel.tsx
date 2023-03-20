import * as _ from 'lodash'
import * as React from 'react'
import { Drawer, Radio, Space, Button } from 'antd'
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
  value: 'aStar',
}, {
  label: 'Best First Search',
  value: 'bestFirst',
}, {
  label: 'Dijkstra\'s Search',
  value: 'dijkstras',
}]

export const Panel: React.FC<Props> = (props: Props) => {
  const [distance, setDistance] = useState(distanceFunctions[0].value)
  const [strategy, setStrategy] = useState(strategies[0].value)

  return (
    <Drawer
      title="2D Map Search"
      placement="right"
      visible={true}
      mask={false}
      closable={false}
    >
      <div className="my-2">
        <div className="mb-2 font-bold">distance</div>
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
        <div className="mb-2 font-bold">strategies</div>
        <Radio.Group
          onChange={e => {
            setStrategy(e.target.value)
            Events.emit('AI:Search:Configs', { strategy: e.target.value })
          }}
          value={strategy}
        >
          <Space direction="vertical">
            {_.map(strategies, strategy => {
              return <Radio value={strategy.value}>{ strategy.label }</Radio>
            })}
          </Space>
        </Radio.Group>
        <div className="my-2">
          <Button onClick={e => Events.emit('AI:Search:Run')}>Run</Button>
        </div>
      </div>
    </Drawer>
  )
}
