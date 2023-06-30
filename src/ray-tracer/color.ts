import { Vector3 } from "@TRE/math";

export class Color extends Vector3 {
  get r() {
    return this.x;
  }

  get g() {
    return this.y;
  }

  get b() {
    return this.z;
  }
}
