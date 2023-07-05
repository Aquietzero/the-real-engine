import { Vector3 } from '@TRE/math'
import { Camera } from '@TRE/ray-tracer/camera'
import { Color } from '@TRE/ray-tracer/color'
import { Sphere, XYRect } from '@TRE/ray-tracer/primitives'
import { Hittables } from '@TRE/ray-tracer/hittables'
import {
  DielectricMaterial,
  LambertianMaterial,
  MetalMaterial,
} from '@TRE/ray-tracer/materials'
import { SolidColor, CheckerTexture } from '@TRE/ray-tracer/texture'
import { DiffuseLight } from '@TRE/ray-tracer/materials'

export const threeBallsScene = (aspectRatio: number) => {
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

  const groundMaterial = new LambertianMaterial({ texture: checkerTexture1 })
  const centerBallMaterial = new LambertianMaterial({
    texture: checkerTexture2,
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

  world.add([
    ground,
    centerBall,
    leftBallInner,
    leftBallOuter,
    rightBall,
    rectLight,
  ])

  return { camera, world }
}
