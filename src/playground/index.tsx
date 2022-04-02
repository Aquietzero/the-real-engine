import * as React from 'react'
import { useParams } from 'react-router-dom'
import { App } from '@TRE/playground/app'
import examples from '@TRE/playground/examples'

interface Props {
}

const { useEffect } = React

let app: App

export const Playground: React.FC<Props> = (props: Props) => {
  const params: any = useParams()

  useEffect(() => {
    if (!app) {
      app = new App()
    }
    app.runExample((examples as any)[params.group][params.example])
  }, [params && params.example])

  return (
    <>
      <canvas id="main-canvas" />
    </>
  )
}
