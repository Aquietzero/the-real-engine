export const clamp = (x: number, min: number, max: number) => {
  if (x < min) return min
  if (x > max) return max
  return x
}

export const random = (from = 0, to = 0): number => {
  return from + Math.random() * (to - from)
}
