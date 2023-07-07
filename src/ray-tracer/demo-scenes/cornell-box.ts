import { Vector3 } from '@TRE/math'
import { Camera } from '@TRE/ray-tracer/camera'
import { Color } from '@TRE/ray-tracer/color'
import { Box, XYRect, YZRect, XZRect } from '@TRE/ray-tracer/primitives'
import { RotateY, Translate } from '@TRE/ray-tracer/hittable'
import { Hittables } from '@TRE/ray-tracer/hittables'
import { LambertianMaterial, MetalMaterial } from '@TRE/ray-tracer/materials'
import { SolidColor } from '@TRE/ray-tracer/texture'
import { DiffuseLight } from '@TRE/ray-tracer/materials'

export const cornellBoxScene = (aspectRatio: number) => {
  const camera = new Camera({
    fov: 40,
    aspectRatio,
  })
  camera.look(
    new Vector3(278, 278, -800),
    new Vector3(278, 278, 0),
    new Vector3(0, 1, 0)
  )

  const red = new SolidColor(new Color(0.65, 0.05, 0.05))
  const white = new SolidColor(new Color(0.73, 0.73, 0.73))
  const green = new SolidColor(new Color(0.12, 0.45, 0.15))
  const redMaterial = new LambertianMaterial({ texture: red })
  const greenMaterial = new LambertianMaterial({ texture: green })
  const whiteMaterial = new LambertianMaterial({ texture: white })

  const aluminumMaterial = new MetalMaterial({
    albedo: new Color(0.8, 0.85, 0.88),
    fuzz: 0,
  })

  const diffuseLight = new DiffuseLight()
  diffuseLight.setTexture(new SolidColor(new Color(15, 15, 15)))

  const leftWall = new YZRect(0, 555, 0, 555, 555)
  const rightWall = new YZRect(0, 555, 0, 555, 0)
  const bottomWall = new XZRect(0, 555, 0, 555, 0)
  const topWall = new XZRect(0, 555, 0, 555, 555)
  const backWall = new XYRect(0, 555, 0, 555, 555)
  const light = new XZRect(213, 343, 227, 332, 554)
  const box1 = new Box(new Vector3(0, 0, 0), new Vector3(165, 330, 165))
  const box2 = new Box(new Vector3(0, 0, 0), new Vector3(165, 165, 165))

  leftWall.setMaterial(redMaterial)
  rightWall.setMaterial(greenMaterial)
  bottomWall.setMaterial(whiteMaterial)
  topWall.setMaterial(whiteMaterial)
  backWall.setMaterial(whiteMaterial)
  light.setMaterial(diffuseLight)
  box1.setMaterial(aluminumMaterial)
  box2.setMaterial(whiteMaterial)

  const rotatedBox1 = new RotateY(box1, 15)
  const rotatedBox2 = new RotateY(box2, -18)
  const translatedBox1 = new Translate(rotatedBox1, new Vector3(265, 0, 265))
  const translatedBox2 = new Translate(rotatedBox2, new Vector3(130, 0, 65))

  const world = new Hittables()

  world.add([
    leftWall,
    rightWall,
    bottomWall,
    topWall,
    backWall,
    light,
    translatedBox1,
    translatedBox2,
  ])

  return { camera, world }
}
