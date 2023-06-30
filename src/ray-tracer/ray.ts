import { Vector3 } from "@TRE/math/vector3";

export class Ray {
  point: Vector3 = new Vector3();
  dir: Vector3 = new Vector3();

  constructor(point: Vector3, dir: Vector3) {
    this.point = point;
    this.dir = dir;
  }

  at(t: number = 1) {
    return this.point.add(this.dir.mul(t));
  }
}
