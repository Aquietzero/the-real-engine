import * as React from 'react'
import * as _ from 'lodash'
import classnames from 'classnames'
import { Link, useParams } from 'react-router-dom'
import examples from '@TRE/playground/examples'

interface Props {
}

export const Nav: React.FC<Props> = (props: Props) => {
  const { example: currExample } = useParams()

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
                  <div>
                    <Link
                      className={classnames(currExample === name && 'text-blue-500')}
                      to={`/examples/${name}`}
                    >
                      { name }
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
