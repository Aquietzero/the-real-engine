import { Ray } from '@TRE/primitive/ray'
import { Color } from '@TRE/ray-tracer/color'
import { Hittables } from '@TRE/ray-tracer/hittables'
import { Camera } from '@TRE/ray-tracer/camera'

interface RayTracerOptions {
  samplesPerPixel: number
  maxReflectDepth: number
}

interface RayTracerContext {
  background: Color
  world: Hittables
  camera: Camera
}

export class RayTracer {
  samplesPerPixel: number
  maxReflectDepth: number

  constructor(opts: RayTracerOptions) {
    this.samplesPerPixel = opts.samplesPerPixel
    this.maxReflectDepth = opts.maxReflectDepth
  }

  rayColor(r: Ray, bg: Color, world: Hittables, depth: number): Color {
    if (depth <= 0) return bg

    // use tMin = 0.0001 to solve the shadow acne problem
    const hitResult = world.hit(r, 0.001)

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
    const scatteredColor = this.rayColor(scattered, bg, world, depth - 1)
    return new Color(
      emitted.x + attenuation.x * scatteredColor.x,
      emitted.y + attenuation.y * scatteredColor.y,
      emitted.z + attenuation.z * scatteredColor.z
    )
  }

  sample(u: number, v: number, ctx: RayTracerContext): Color {
    let c = new Color(0, 0, 0)
    for (let s = 0; s < this.samplesPerPixel; s++) {
      const r = ctx.camera.getRay(u, v)
      const color = this.rayColor(
        r,
        ctx.background,
        ctx.world,
        this.maxReflectDepth
      )
      c = c.add(color) as Color
    }
    return c
  }
}
