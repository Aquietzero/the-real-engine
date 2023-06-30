import { Vector3 } from '@TRE/math'
import { Camera } from '@TRE/ray-tracer/camera'
import { Ray } from '@TRE/ray-tracer/ray'
import { Color } from '@TRE/ray-tracer/color'

const camera = new Camera()
const aspectRatio = 16 / 9

const rayColor = (r: Ray): Color => {
  if (hitSphere(new Vector3(0, 0, -1), 0.5, r)) {
    return new Color(1, 0, 0)
  }

  const unitDirection = r.dir.normalize()
  const t = 0.5 * (unitDirection.y + 1)
  const c1 = new Vector3(1, 1, 1)
  const c2 = new Vector3(0.5, 0.7, 1)
  const c = c1.mul(1 - t).add(c2.mul(t))
  return new Color(c.x, c.y, c.z)
}

const hitSphere = (center: Vector3, radius: number, r: Ray): boolean => {
  const oc = r.point.sub(center)
  const a = Vector3.dotProduct(r.dir, r.dir)
  const b = 2 * Vector3.dotProduct(oc, r.dir)
  const c = Vector3.dotProduct(oc, oc) - radius * radius
  const discriminant = b * b - 4 * a * c
  return discriminant > 0
}

export const renderImage = (width: number = 500) => {
  const canvas: any = document.getElementById('ray-tracer-canvas')
  const ctx = canvas.getContext('2d')

  const height = width / aspectRatio
  canvas.width = width
  canvas.height = height

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const u = x / width
      const v = y / height

      const r = new Ray(
        camera.origin,
        camera.lowerLeftCorner
          .add(camera.horizontal.mul(u))
          .add(camera.vertical.mul(v))
          .sub(camera.origin)
      )
      const color = rayColor(r)

      const red = color.r * 256
      const green = color.g * 256
      const blue = color.b * 256

      ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`
      ctx.fillRect(x, height - y, 1, 1)
    }
  }
}
