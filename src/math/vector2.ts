// Vector in 2d Euclidean space.
export class Vector2 {
  public x: number = 0
  public y: number = 0

  constructor(x: number = 0, y: number = 0) {
    this.x = x
    this.y = y
  }

  public equals(v: Vector2): boolean {
    return this.x === v.x && this.y === v.y
  }

  public clone(): Vector2 {
    return new Vector2(this.x, this.y)
  }

  public manhattanDistance2(v: Vector2): number {
    return Math.abs(this.x - v.x) + Math.abs(this.y - v.y)
  }

  public euclideanDistance2(v: Vector2): number {
    return Math.sqrt(
      (this.x - v.x) * (this.x - v.x) +
      (this.y - v.y) * (this.y - v.y))
  }
}
