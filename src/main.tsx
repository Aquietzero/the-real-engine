import * as React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
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
        <Route
          path="*"
          element={
            <div className="w-full h-full flex flex-col items-center justify-center">
              <Link
                className="text-4xl"
                to="/examples/math/ObjTransformationsExample"
              >
                TRE - The Real Engine
              </Link>
              <div>by Aquietzero@github.com</div>
            </div>
          }
        />
      </Routes>
    </>
  )
}

