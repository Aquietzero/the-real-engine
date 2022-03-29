import * as React from 'react'
import { App } from '@TRE/playground/app'
import { Nav } from '@TRE/playground/components/nav'

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
    </>
  )
}

