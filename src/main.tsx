import * as React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Playground } from './playground'
import { Nav } from '@TRE/playground/components/nav'
import { Panel } from '@TRE/playground/components/panel'

export const Main: React.FC = () => {
  return (
    <>
      <Routes>
        <Route
          path="/examples/:group/:example"
          element={
            <>
              <Playground />
              <Nav />
              <Panel />
            </>
          }
        />
      </Routes>
    </>
  )
}

