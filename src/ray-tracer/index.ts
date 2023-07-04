import { Vector3 } from '@TRE/math'
import { Camera } from '@TRE/ray-tracer/camera'
import { Ray } from '@TRE/primitive/ray'
import { Color } from '@TRE/ray-tracer/color'
import { Sphere } from '@TRE/ray-tracer/sphere'
import { Hittables } from '@TRE/ray-tracer/hittables'
import { clamp } from '@TRE/ray-tracer/utils'
import {
  DielectricMaterial,
  LambertianMaterial,
  MetalMaterial,
} from '@TRE/ray-tracer/materials'
import { SolidColor, CheckerTexture, Texture } from '@TRE/ray-tracer/texture'
import { DiffuseLight } from './materials/diffuse-light'
import { XYRect } from './xy-rect'

const SAMPLES_PER_PIXEL = 10
const COLOR_SCALE = 1 / SAMPLES_PER_PIXEL
const MAX_REFLECT_DEPTH = 20

const rayColor = (
  r: Ray,
  bg: Color,
  world: Hittables,
  depth: number
): Color => {
  if (depth <= 0) return new Color(0, 0, 0)

  // use tMin = 0.0001 to solve the shadow acne problem
  const hitResult = world.hit(r, 0.000001)

  // hits nothing
  if (!hitResult.doesHit) return bg

  const hitRecord = hitResult.hitRecord

  const materialScatter: any = hitRecord.material.scatter(r, hitRecord)
  const emitted = hitRecord.material.emitted(
    hitRecord.u,
    hitRecord.v,
    hitRecord.point
  )
  if (!materialScatter.isValid) return emitted

  const { attenuation, scattered } = materialScatter
  const scatteredColor = rayColor(scattered, bg, world, depth - 1)
  return new Color(
    emitted.x + attenuation.x * scatteredColor.x,
    emitted.y + attenuation.y * scatteredColor.y,
    emitted.z + attenuation.z * scatteredColor.z
  )
}

const writeColor = (color: Color) => {
  // sqrt: gamma correction
  let r = Math.sqrt(color.x * COLOR_SCALE)
  let g = Math.sqrt(color.y * COLOR_SCALE)
  let b = Math.sqrt(color.z * COLOR_SCALE)

  r = 256 * clamp(r, 0, 1)
  g = 256 * clamp(g, 0, 1)
  b = 256 * clamp(b, 0, 1)

  return {
    r,
    g,
    b,
    str: `rgb(${r}, ${g}, ${b})`,
  }
}

const threeBallsScene = (aspectRatio: number) => {
  const camera = new Camera({
    fov: 40,
    aspectRatio,
  })
  camera.look(
    new Vector3(-3, 2, 0),
    new Vector3(0, 0, -1),
    new Vector3(0, 1, 0)
  )

  const checkerTexture1 = new CheckerTexture(
    new SolidColor(new Color(0.2, 0.3, 0.1)),
    new SolidColor(new Color(0.9, 0.9, 0.9))
  )
  const checkerTexture2 = new CheckerTexture(
    new SolidColor(new Color(0.1, 0.2, 0.5)),
    new SolidColor(new Color(0.9, 0.9, 0.9)),
    50
  )

  const groundMaterial = new LambertianMaterial({
    albedo: new Color(0.8, 0.8, 0.8),
  })
  groundMaterial.setTexture(checkerTexture1)
  const centerBallMaterial = new LambertianMaterial({
    albedo: new Color(0.1, 0.2, 0.5),
  })
  centerBallMaterial.setTexture(checkerTexture2)
  const metalMaterial1 = new MetalMaterial({
    albedo: new Color(0.8, 0.6, 0.2),
    fuzz: 0,
  })
  const metalMaterial2 = new MetalMaterial({
    albedo: new Color(0.8, 0.6, 0.2),
    fuzz: 1,
  })
  const dielectricMaterial = new DielectricMaterial({
    refractiveIndex: 1.5,
  })
  const diffuseLight = new DiffuseLight()
  diffuseLight.setTexture(new SolidColor(new Color(4, 4, 4)))

  const ground = new Sphere(new Vector3(0, -100.5, -1), 100)
  const centerBall = new Sphere(new Vector3(0, 0, -1), 0.5)
  const leftBallInner = new Sphere(new Vector3(-1, 0, -1), -0.4)
  const leftBallOuter = new Sphere(new Vector3(-1, 0, -1), 0.5)
  const rightBall = new Sphere(new Vector3(1, 0, -1), 0.5)
  const rectLight = new XYRect(-1, 1, 0, 1, -2)

  ground.setMaterial(groundMaterial)
  centerBall.setMaterial(centerBallMaterial)
  leftBallInner.setMaterial(dielectricMaterial)
  leftBallOuter.setMaterial(dielectricMaterial)
  rightBall.setMaterial(metalMaterial1)
  rectLight.setMaterial(diffuseLight)

  const world = new Hittables()

  world.add(ground)
  world.add(centerBall)
  world.add(leftBallInner)
  world.add(leftBallOuter)
  world.add(rightBall)
  world.add(rectLight)

  return { camera, world }
}

const manyBallsScene = (aspectRatio: number) => {
  const world = new Hittables()

  const groundMaterial = new LambertianMaterial({
    albedo: new Color(0.5, 0.5, 0.5),
  })
  const ground = new Sphere(new Vector3(0, -1000, 0), 1000)
  ground.setMaterial(groundMaterial)
  world.add(ground)

  const gridSize = 10
  const step = 3
  for (let a = -gridSize; a < gridSize; a += step) {
    for (let b = -gridSize; b < gridSize; b += step) {
      const random = Math.random()
      const center = new Vector3(
        a + 0.9 * Math.random() * step,
        0.2,
        b + 0.9 * Math.random() * step
      )

      const ball = new Sphere(center, 0.2)
      let material
      if (center.sub(new Vector3(4, 0.2, 0)).len() > 0.9) {
        if (random < 0.8) {
          // diffuse
          material = new LambertianMaterial({
            albedo: Color.random(),
          })
        } else if (random < 0.95) {
          // metal
          material = new MetalMaterial({
            albedo: Color.random(),
            fuzz: Math.random() * 0.5,
          })
        } else {
          // glass
          material = new DielectricMaterial({ refractiveIndex: 1.5 })
        }

        ball.setMaterial(material)
        world.add(ball)
      }
    }
  }

  // three big balls
  const m1 = new DielectricMaterial({ refractiveIndex: 1.5 })
  const b1 = new Sphere(new Vector3(0, 1, 0), 1.0)
  b1.setMaterial(m1)

  const m2 = new LambertianMaterial({ albedo: new Color(0.4, 0.2, 0.1) })
  const b2 = new Sphere(new Vector3(-4, 1, 0), 1.0)
  b2.setMaterial(m2)

  const m3 = new MetalMaterial({ albedo: new Color(0.7, 0.6, 0.5), fuzz: 0 })
  const b3 = new Sphere(new Vector3(4, 1, 0), 1.0)
  b3.setMaterial(m3)

  world.add(b1)
  world.add(b2)
  world.add(b3)

  const camera = new Camera({ aspectRatio: 3 / 2, fov: 20 })
  camera.look(new Vector3(13, 2, 3), new Vector3(0, 0, 0), new Vector3(0, 1, 0))

  return { camera, world }
}

export const renderImage = (width: number = 800) => {
  const start = Date.now()

  const canvas: any = document.getElementById('ray-tracer-canvas')
  const ctx = canvas.getContext('2d')

  const aspectRatio = 16 / 9
  const bg = new Color(0.7, 0.8, 1)

  const { camera, world } = threeBallsScene(aspectRatio)
  // const { camera, world } = manyBallsScene(aspectRatio)

  console.log(world)

  const height = width / aspectRatio
  canvas.width = width
  canvas.height = height

  const imageData = ctx.createImageData(width, height)

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let c = new Color(0, 0, 0)
      for (let s = 0; s < SAMPLES_PER_PIXEL; s++) {
        const u = (x + Math.random()) / width
        const v = (y + Math.random()) / height

        const r = camera.getRay(u, v)
        const color = rayColor(r, bg, world, MAX_REFLECT_DEPTH)
        c = c.add(color) as Color
      }

      const { r, g, b } = writeColor(c)
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
