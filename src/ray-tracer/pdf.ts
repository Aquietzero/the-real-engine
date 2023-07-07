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

export class MixturePDF extends PDF {
  pdfs: PDF[] = []

  constructor(p0: PDF, p1: PDF) {
    super()

    this.pdfs.push(p0)
    this.pdfs.push(p1)
  }

  value(dir: Vector3): number {
    const [p0, p1] = this.pdfs
    return 0.5 * p0.value(dir) + 0.5 * p1.value(dir)
  }

  generate(): Vector3 {
    const [p0, p1] = this.pdfs

    if (Math.random() < 0.5) return p0.generate()
    return p1.generate()
  }
}
