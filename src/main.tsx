import * as React from 'react'
import { App } from '@TRE/playground/app'

const { useEffect } = React

export const Main: React.FC = () => {

  useEffect(() => {
    new App()
  })

  return (
    <>
      <canvas id="main-canvas" />
    </>
  )
}

