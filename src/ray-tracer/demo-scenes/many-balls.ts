import { Vector3 } from '@TRE/math'
import { Camera } from '@TRE/ray-tracer/camera'
import { Color } from '@TRE/ray-tracer/color'
import { Sphere } from '@TRE/ray-tracer/primitives'
import { Hittables } from '@TRE/ray-tracer/hittables'
import {
  DielectricMaterial,
  LambertianMaterial,
  MetalMaterial,
} from '@TRE/ray-tracer/materials'
import { SolidColor } from '@TRE/ray-tracer/texture'

export const manyBallsScene = (aspectRatio: number) => {
  const world = new Hittables()

  const groundMaterial = new LambertianMaterial({
    texture: new SolidColor(new Color(0.5, 0.5, 0.5)),
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
            texture: new SolidColor(Color.random()),
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

  const m2 = new LambertianMaterial({
    texture: new SolidColor(new Color(0.4, 0.2, 0.1)),
  })
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
