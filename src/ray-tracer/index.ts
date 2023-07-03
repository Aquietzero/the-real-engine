import { Vector3 } from '@TRE/math'
import { Camera } from '@TRE/ray-tracer/camera'
import { Ray } from '@TRE/ray-tracer/ray'
import { Color } from '@TRE/ray-tracer/color'
import { Sphere } from '@TRE/ray-tracer/sphere'
import { Hittables } from '@TRE/ray-tracer/hittables'
import { clamp } from '@TRE/ray-tracer/utils'
import {
  DielectricMaterial,
  LambertianMaterial,
  MetalMaterial,
} from '@TRE/ray-tracer/material'

const SAMPLES_PER_PIXEL = 50
const MAX_REFLECT_DEPTH = 20

const rayColor = (r: Ray, world: Hittables, depth: number): Color => {
  if (depth <= 0) return new Color(0, 0, 0)

  // use tMin = 0.0001 to solve the shadow acne problem
  const hitResult = world.hit(r, 0.000001)
  if (hitResult.doesHit) {
    const hitRecord = hitResult.hitRecord
    // without material
    if (!hitRecord.material) {
      const target = hitRecord.point
        .add(hitRecord.normal)
        .add(Vector3.randomInUnitSphere())
      const reflectedRay = new Ray(hitRecord.point, target.sub(hitRecord.point))
      return rayColor(reflectedRay, world, depth - 1).mul(0.5) as Color
    }

    // with material
    const materialScatter: any = hitRecord.material.scatter(r, hitRecord)
    if (materialScatter.isValid) {
      const { attenuation, scattered } = materialScatter
      const scatteredColor = rayColor(scattered, world, depth - 1)
      return new Color(
        attenuation.x * scatteredColor.x,
        attenuation.y * scatteredColor.y,
        attenuation.z * scatteredColor.z
      )
    }

    return new Color(0, 0, 0)
  }

  const unitDirection = r.dir.normalize()
  const t = 0.5 * (unitDirection.y + 1)
  const c1 = new Vector3(1, 1, 1)
  const c2 = new Vector3(0.5, 0.7, 1)
  const c = c1.mul(1 - t).add(c2.mul(t))
  return new Color(c.x, c.y, c.z)
}

const writeColor = (color: Color, samplesPerPixel: number) => {
  const scale = 1 / samplesPerPixel
  // sqrt: gamma correction
  let r = Math.sqrt(color.x * scale)
  let g = Math.sqrt(color.y * scale)
  let b = Math.sqrt(color.z * scale)

  r = 256 * clamp(r, 0, 1)
  g = 256 * clamp(g, 0, 1)
  b = 256 * clamp(b, 0, 1)

  return `rgb(${r}, ${g}, ${b})`
}

const threeBallsScene = (aspectRatio: number) => {
  const camera = new Camera({
    fov: 40,
    aspectRatio,
  })
  camera.look(
    new Vector3(-1, 1, 1),
    new Vector3(0, 0, -1),
    new Vector3(0, 1, 0)
  )

  const groundMaterial = new LambertianMaterial({
    albedo: new Color(0.8, 0.8, 0.8),
  })
  const centerBallMaterial = new LambertianMaterial({
    albedo: new Color(0.1, 0.2, 0.5),
  })
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

  const ground = new Sphere(new Vector3(0, -100.5, -1), 100)
  const centerBall = new Sphere(new Vector3(0, 0, -1), 0.5)
  const leftBallInner = new Sphere(new Vector3(-1, 0, -1), -0.4)
  const leftBallOuter = new Sphere(new Vector3(-1, 0, -1), 0.5)
  const rightBall = new Sphere(new Vector3(1, 0, -1), 0.5)

  ground.setMaterial(groundMaterial)
  centerBall.setMaterial(centerBallMaterial)
  leftBallInner.setMaterial(dielectricMaterial)
  leftBallOuter.setMaterial(dielectricMaterial)
  rightBall.setMaterial(metalMaterial1)

  const world = new Hittables()

  world.add(ground)
  world.add(centerBall)
  world.add(leftBallInner)
  world.add(leftBallOuter)
  world.add(rightBall)

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

export const renderImage = (width: number = 500) => {
  const canvas: any = document.getElementById('ray-tracer-canvas')
  const ctx = canvas.getContext('2d')

  const aspectRatio = 16 / 9

  const { camera, world } = threeBallsScene(aspectRatio)
  // const { camera, world } = manyBallsScene(aspectRatio)

  const height = width / aspectRatio
  canvas.width = width
  canvas.height = height

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let c = new Color(0, 0, 0)
      for (let s = 0; s < SAMPLES_PER_PIXEL; s++) {
        const u = (x + Math.random()) / width
        const v = (y + Math.random()) / height

        const r = camera.getRay(u, v)
        const color = rayColor(r, world, MAX_REFLECT_DEPTH)
        c = c.add(color) as Color
      }

      ctx.fillStyle = writeColor(c, SAMPLES_PER_PIXEL)
      ctx.fillRect(x, height - y, 1, 1)
    }
  }
}
