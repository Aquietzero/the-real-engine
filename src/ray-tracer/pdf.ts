import { Vector3, ONB } from '@TRE/math'
import { Hittable } from '@TRE/ray-tracer/hittable'

export class PDF {
  value(dir: Vector3): number {
    return 0
  }

  generate(): Vector3 {
    return new Vector3()
  }
}

export class CosinePDF extends PDF {
  uvw: ONB = new ONB()

  constructor(w: Vector3) {
    super()
    this.uvw.buildFromW(w)
  }

  value(dir: Vector3): number {
    const cosine = Vector3.dotProduct(dir.normalize(), this.uvw.w)
    return cosine <= 0 ? 0 : cosine / Math.PI
  }

  generate(): Vector3 {
    return this.uvw.local(Vector3.randomCosineDirection())
  }
}

export class HittablePDF extends PDF {
  origin: Vector3
  hittable: Hittable

  constructor(origin: Vector3, hittable: Hittable) {
    super()

    this.origin = origin
    this.hittable = hittable
  }

  value(dir: Vector3): number {
    return this.hittable.pdfValue(this.origin, dir)
  }

  generate(): Vector3 {
    return this.hittable.random(this.origin)
  }
}
