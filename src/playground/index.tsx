import * as React from 'react'
import { useParams } from 'react-router-dom'
import { App } from '@TRE/playground/app'
import { Nav } from '@TRE/playground/components/nav'
import examples from '@TRE/playground/examples'

interface Props {
}

const { useEffect } = React

let app: App

export const Playground: React.FC<Props> = (props: Props) => {
  const params: any = useParams()
  const example = (examples as any)[params.group][params.example]

  const Panel = () => {
    const panel = example?.panel
    return panel ? panel() : <></>
  }

  useEffect(() => {
    if (!app) {
      app = new App()
    }
    app.runExample(example)
  }, [params && params.example])

  return (
    <>
      <canvas id="main-canvas" />
      <Nav />
      <Panel />
    </>
  )
}
