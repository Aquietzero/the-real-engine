import * as React from 'react'
import * as _ from 'lodash'
import classnames from 'classnames'
import { Link, useParams } from 'react-router-dom'
import examples from '@TRE/playground/examples'

interface Props {
}

export const Nav: React.FC<Props> = (props: Props) => {
  const { example: currExample } = useParams()

  const formatName = (name: string) => {
    return _.snakeCase(name.replace('Example', '')).replace(/_/g, ' ')
  }

  return (
    <div
      className="fixed h-full left-0 top-0 cursor-pointer pl-5 flex justify-center items-center"
    >
      {_.map(examples, (group, title)  => {
        return (
          <div key={title}>
            <div className="font-bold">{ title }</div>
            <div className="pl-5">
              {_.map(group, (example, name) => {
                return (
                  <div key={name}>
                    <Link
                      className={classnames(currExample === name && 'text-blue-500')}
                      to={`/examples/${name}`}
                    >
                      { formatName(name) }
                    </Link>
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
