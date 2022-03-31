import * as React from 'react'
import { App } from '@TRE/playground/app'
import { Nav } from '@TRE/playground/components/nav'
import { Panel } from '@TRE/playground/components/panel'

const { useState, useEffect } = React

export const Main: React.FC = () => {
  const [app, setApp] = useState<any>()

  useEffect(() => {
    if (!app) {
      setApp(new App())
    }
  })

  return (
    <>
      <canvas id="main-canvas" />
      <Nav app={app} />
      <Panel />
    </>
  )
}

