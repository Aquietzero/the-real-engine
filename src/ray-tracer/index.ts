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

const SAMPLES_PER_PIXEL = 10
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

export const renderImage = (width: number = 500) => {
  const canvas: any = document.getElementById('ray-tracer-canvas')
  const ctx = canvas.getContext('2d')

  const camera = new Camera()
  const aspectRatio = 16 / 9

  const groundMaterial = new LambertianMaterial({
    albedo: new Color(0.8, 0.8, 0),
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
  const leftBall = new Sphere(new Vector3(-1, 0, -1), -0.4)
  const rightBall = new Sphere(new Vector3(1, 0, -1), 0.5)

  ground.setMaterial(groundMaterial)
  centerBall.setMaterial(centerBallMaterial)
  leftBall.setMaterial(dielectricMaterial)
  rightBall.setMaterial(metalMaterial1)

  const world = new Hittables()

  world.add(ground)
  world.add(centerBall)
  world.add(leftBall)
  world.add(rightBall)

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
