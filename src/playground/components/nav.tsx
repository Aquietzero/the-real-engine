import * as React from 'react'
import * as _ from 'lodash'
import classnames from 'classnames'
import VectorsExample from '@TRE/playground/examples/math/vectors'
import ConnectedVectorsExample from '@TRE/playground/examples/math/connected-vectors'

interface Props {
  app: any
}

const { useEffect, useState } = React

const examples = {
  math: {
    VectorsExample,
    ConnectedVectorsExample,
  }
}

export const Nav: React.FC<Props> = (props: Props) => {
  const { app } = props
  const [currExample, setCurrExample] = useState('VectorsExample')

  const runExample = (name: string, example: any) => {
    setCurrExample(name)
    app.runExample(example)
  }

  useEffect(() => {
    if (app) app.runExample(VectorsExample)
  }, [app])

  return (
    <div
      className="fixed h-full left-0 top-0 cursor-pointer pl-5 flex justify-center items-center"
    >
      {_.map(examples, (group, title)  => {
        return (
          <div>
            <div className="font-bold">{ title }</div>
            <div className="pl-5">
              {_.map(group, (example, name) => {
                return (
                  <div
                    className={classnames(currExample === name && 'text-blue-500')}
                    onClick={() => runExample(name, example)}>
                    { name }
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
