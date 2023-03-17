import { Vector3, Matrix4 } from '@TRE/math'
import { Geometry } from './geometry'

export class Object3D {
  // world position of the object
  position: Vector3 = new Vector3()
  // world direction the object is facing to
  direction: Vector3 = new Vector3()
  // geometry
  geometry: Geometry
}
