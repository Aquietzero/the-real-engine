import { Color, writeColor } from '@TRE/ray-tracer/color'
import { RayTracer } from '@TRE/ray-tracer/ray-tracer'
import { threeBallsScene } from './demo-scenes/three-balls'
import { manyBallsScene } from './demo-scenes/many-balls'

const SAMPLES_PER_PIXEL = 10
const COLOR_SCALE = 1 / SAMPLES_PER_PIXEL
const MAX_REFLECT_DEPTH = 20

const rayTracer = new RayTracer({
  samplesPerPixel: SAMPLES_PER_PIXEL,
  maxReflectDepth: MAX_REFLECT_DEPTH,
})

export const renderImage = (width: number = 800) => {
  const start = Date.now()

  const canvas: any = document.getElementById('ray-tracer-canvas')
  const ctx = canvas.getContext('2d')

  const aspectRatio = 16 / 9
  const bg = new Color(0.7, 0.8, 1)

  const { camera, world } = threeBallsScene(aspectRatio)
  // const { camera, world } = manyBallsScene(aspectRatio)

  const height = width / aspectRatio
  canvas.width = width
  canvas.height = height

  const imageData = ctx.createImageData(width, height)

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const c = rayTracer.sample(
        (x + Math.random()) / width,
        (y + Math.random()) / height,
        { camera, background: bg, world }
      )

      const { r, g, b } = writeColor(c, COLOR_SCALE)
      const index = ((height - y) * width + x) * 4
      imageData.data[index] = r
      imageData.data[index + 1] = g
      imageData.data[index + 2] = b
      imageData.data[index + 3] = 255
    }
  }

  ctx.putImageData(imageData, 0, 0)

  const end = Date.now()
  const renderTime = ((end - start) / 1000).toFixed(3)

  return {
    renderTime,
  }
}
