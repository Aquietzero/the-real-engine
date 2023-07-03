import * as _ from 'lodash'
import * as React from 'react'
import { renderImage } from '@TRE/ray-tracer'

export const BasicRayTracerExample: React.FC = () => {
  const [renderInfo, setRenderInfo] = React.useState({} as any)

  React.useLayoutEffect(() => {
    if (!renderInfo.renderTime) {
      const info = renderImage()
      setRenderInfo(info)
    }
  })

  return (
    <div className="flex w-full h-full flex-col justify-center items-center">
      <canvas id="ray-tracer-canvas" />
      <div>render time: { renderInfo.renderTime }(s)</div>
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
