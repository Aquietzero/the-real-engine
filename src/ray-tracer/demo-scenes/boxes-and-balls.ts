import { Vector3 } from '@TRE/math'
import { Camera } from '@TRE/ray-tracer/camera'
import { Color } from '@TRE/ray-tracer/color'
import { Box, Sphere, XZRect } from '@TRE/ray-tracer/primitives'
import { Hittables } from '@TRE/ray-tracer/hittables'
import { LambertianMaterial, MetalMaterial } from '@TRE/ray-tracer/materials'
import { SolidColor, CheckerTexture } from '@TRE/ray-tracer/texture'
import { DiffuseLight } from '@TRE/ray-tracer/materials'

export const boxesAndBallsScene = (aspectRatio: number) => {
  const camera = new Camera({
    fov: 40,
    aspectRatio,
  })
  camera.look(
    new Vector3(1000, 300, 1000),
    new Vector3(500, 0, 500),
    new Vector3(0, 1, 0)
  )

  const red = new SolidColor(new Color(0.65, 0.05, 0.05))
  const white = new SolidColor(new Color(0.73, 0.73, 0.73))
  const green = new SolidColor(new Color(0.48, 0.83, 0.53))
  const redMaterial = new LambertianMaterial({ texture: red })
  const greenMaterial = new LambertianMaterial({ texture: green })
  const whiteMaterial = new LambertianMaterial({ texture: white })
  const metalMaterial = new MetalMaterial({
    albedo: new Color(0.8, 0.6, 0.2),
    fuzz: 2,
  })

  const diffuseLight = new DiffuseLight()
  diffuseLight.setTexture(new SolidColor(new Color(15, 15, 15)))

  const boxes = []
  const offset = 200
  for (let x = 0; x < 1000; x += offset) {
    for (let z = 0; z < 1000; z += offset) {
      const height = Math.random() * 100
      const box = new Box(
        new Vector3(x, 0, z),
        new Vector3(x + offset, height, z + offset)
      )
      box.setMaterial(greenMaterial)
      boxes.push(box)
    }
  }

  const metalBall = new Sphere(new Vector3(500, 500, 150), 50)
  metalBall.setMaterial(metalMaterial)

  const light = new XZRect(400, 600, 400, 600, 400)
  light.setMaterial(diffuseLight)

  const world = new Hittables()

  world.add([light, metalBall, ...boxes])

  return { camera, world }
}
