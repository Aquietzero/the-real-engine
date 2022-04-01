import * as React from 'react'
import { useParams } from 'react-router-dom'
import { App } from '@TRE/playground/app'
import examples from '@TRE/playground/examples'

interface Props {
}

const { useEffect } = React

export const Playground: React.FC<Props> = (props: Props) => {
  const params = useParams()

  useEffect(() => {
    const example: string = params.example
    const app = new App()
    app.runExample(examples.math[example])
  })

  return (
    <>
      <canvas id="main-canvas" />
    </>
  )
}
