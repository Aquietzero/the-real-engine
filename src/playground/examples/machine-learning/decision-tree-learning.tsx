import * as _ from 'lodash'
import * as React from 'react'
import cx from 'classnames'
import { getId, Graph, GraphRenderer, LineType, GraphDirection } from '@tencent/simple-graph'
import { Examples } from '@TRE/machine-learning/core/examples'
import { DecisionTreeLearner } from '@TRE/machine-learning/decision-tree-learner'


const columns = [
  { name: 'Alternative', values: [true, false] },
  { name: 'Bar', values: [true, false] },
  { name: 'Friday', values: [true, false] },
  { name: 'Hungry', values: [true, false] },
  { name: 'Patrons', values: ['Some', 'Full', 'None'] },
  { name: 'Price', values: ['$', '$$', '$$$'] },
  { name: 'Rain', values: [true, false] },
  { name: 'Reservation', values: [true, false] },
  { name: 'Type', values: ['French', 'Thai', 'Italian', 'Burger'] },
  { name: 'WaitEstimate', values: ['0-10', '10-30', '30-60', '>60'] },
]

const data = [
  // alt bar    friday hun   pat     price  rain   res   type      est
  [true, false, false, true, 'Some', '$$$', false, true, 'French', '0-10', true],
  [true, false, false, true, 'Full', '$', false, false, 'Thai', '30-60', false],
  [false, true, false, false, 'Some', '$', false, false, 'Burger', '0-10', true],
  [true, false, true, true, 'Full', '$', true, false, 'Thai', '10-30', true],
  [true, false, true, false, 'Full', '$$$', false, true, 'French', '>60', false],
  [false, true, false, true, 'Some', '$$', true, true, 'Italian', '0-10', true],
  [false, true, false, false, 'None', '$', true, false, 'Burger', '0-10', false],
  [false, false, false, true, 'Some', '$$', true, true, 'Thai', '0-10', true],
  [false, true, true, false, 'Full', '$', true, false, 'Burger', '>60', false],
  [true, true, true, true, 'Full', '$$$', false, true, 'Italian', '10-30', false],
  [false, false, false, false, 'None', '$', false, false, 'Thai', '0-10', false],
  [true, true, true, true, 'Full', '$', false, false, 'Burger', '30-60', true],
]

const toGraph = (t: any) => {
  const nodes: any = []
  const edges: any = []

  const tree = _.cloneDeep(t)

  const iter = (node: any, parent?: any) => {
    const startNode = { id: node.id, data: _.cloneDeep(_.omit(node, 'children')) }
    if (parent?.attribute?.name) {
      startNode.data.condition = `${parent.attribute.name} is ${startNode.data.value}`
    }
    nodes.push(startNode)

    _.each(node.children || [], child => {
      const endNode = { id: child.id, data: _.cloneDeep(_.omit(child, 'children')) }
      const edge = { id: getId(), start: startNode.id, end: endNode.id }

      edges.push(edge)
      iter(child, node)
    })
  }

  iter(tree)

  return new Graph({ root: nodes[0].id, nodes, edges })
}

export const DecisionTreeLearning: React.FC = () => {
  const examples = new Examples(data, columns)
  const learner = new DecisionTreeLearner(examples, columns)
  learner.learn()
  const g = toGraph(learner.tree)
  const renderNode = (node: any) => {
    return (
      <div className="flex flex-col items-center justify-center">
        <div
          className={cx(
            'flex flex-col items-center justify-center py-2 px-4 rounded border-solid border-black'
          )}
        >
          {
            node.data?.condition &&
            <div className="font-bold text-10">{node.data.condition}</div>
          }
          {
            node.children.length === 0 &&
            <div className="font-bold text-blue-500 text-10">{
              _.upperCase(String(node.data?.result))
            }</div>
          }
        </div>
      </div>
    )
  }

  const graphConfig = {
    graph: {
      editable: false,
      showLayoutGrid: false,
      direction: GraphDirection.Vertical,
      ySpacing: 45,
      xSpacing: 10,
    },
    edge: {
      showArrow: false,
      lineType: LineType.Bezier,
    },
    node: { renderNode }
  }
    
  return (
    <GraphRenderer graph={g} renderConfig={graphConfig} />
  )
}

export default {
  description: 'machine learning algorithms.',
  notCanvas: true,
  run(app: any) {
    return (
      <div className="w-full h-full pl-20">
        <DecisionTreeLearning />
      </div>
    )
  }
}
