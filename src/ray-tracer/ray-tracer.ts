import { Ray } from '@TRE/primitive/ray'
import { Color } from '@TRE/ray-tracer/color'
import { Hittable } from '@TRE/ray-tracer/hittable'
import { Hittables } from '@TRE/ray-tracer/hittables'
import { Camera } from '@TRE/ray-tracer/camera'
import { CosinePDF, HittablePDF, MixturePDF } from '@TRE/ray-tracer/pdf'

interface RayTracerOptions {
  samplesPerPixel: number
  maxReflectDepth: number
}

interface RayTracerContext {
  background: Color
  world: Hittables
  lights: Hittable
  camera: Camera
}

export class RayTracer {
  samplesPerPixel: number
  maxReflectDepth: number

  constructor(opts: RayTracerOptions) {
    this.samplesPerPixel = opts.samplesPerPixel
    this.maxReflectDepth = opts.maxReflectDepth
  }

  rayColor(
    r: Ray,
    bg: Color,
    world: Hittables,
    lights: Hittable,
    depth: number
  ): Color {
    if (depth <= 0) return bg

    // use tMin = 0.0001 to solve the shadow acne problem
    const hitResult = world.hit(r, 0.001)

    // hits nothing
    if (!hitResult.doesHit) return bg

    const hitRecord = hitResult.hitRecord

    const scatterRecord: any = hitRecord.material.scatter(r, hitRecord)
    const emitted = hitRecord.material.emitted(
      hitRecord.u,
      hitRecord.v,
      hitRecord.point
    )
    if (!scatterRecord.isValid) return emitted

    if (scatterRecord.isSpecular) {
      const specularColor = this.rayColor(
        scatterRecord.specularRay,
        bg,
        world,
        lights,
        depth - 1
      )
      return new Color(
        scatterRecord.attenuation.x * specularColor.x,
        scatterRecord.attenuation.y * specularColor.y,
        scatterRecord.attenuation.z * specularColor.z
      )
    }

    const lightPDF = new HittablePDF(hitRecord.point, lights)
    const mixturePDF = new MixturePDF(lightPDF, scatterRecord.pdf)
    const scattered = new Ray(hitRecord.point, mixturePDF.generate())
    const pdf = mixturePDF.value(scattered.dir)

    const scatteredColor = this.rayColor(
      scattered,
      bg,
      world,
      lights,
      depth - 1
    )
    const resultColor = emitted.add(
      new Color(
        scatterRecord.attenuation.x * scatteredColor.x,
        scatterRecord.attenuation.y * scatteredColor.y,
        scatterRecord.attenuation.z * scatteredColor.z
      ).mul(hitRecord.material.scatteringPDF(r, hitRecord, scattered) / pdf)
    )
    return new Color(resultColor.x, resultColor.y, resultColor.z)
  }

  sample(u: number, v: number, ctx: RayTracerContext): Color {
    let c = new Color(0, 0, 0)
    for (let s = 0; s < this.samplesPerPixel; s++) {
      const r = ctx.camera.getRay(u, v)
      const color = this.rayColor(
        r,
        ctx.background,
        ctx.world,
        ctx.lights,
        this.maxReflectDepth
      )
      c = c.add(color) as Color
    }
    return c
  }
}
