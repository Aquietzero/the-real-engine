import * as _ from 'lodash'
import * as React from 'react'
import { renderImage } from '@TRE/ray-tracer'

export const BasicRayTracerExample: React.FC = () => {
  React.useEffect(() => {
    renderImage(800)
  })

  return (
    <div className="flex w-full h-full justify-center items-center">
      <canvas id="ray-tracer-canvas" />
    </div>
  )
}

export default {
  description: 'basic ray tracer.',
  notCanvas: true,
  run(app: any) {
    return (
      <div className="w-full h-full pl-20">
        <BasicRayTracerExample />
      </div>
    )
  }
}
