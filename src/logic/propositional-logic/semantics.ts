export default {
  NEGATE: (values: boolean[]): boolean => !values[0],
  AND: (values: boolean[]): boolean => values[0] && values[1],
  OR: (values: boolean[]): boolean => values[0] || values[1],
  // p => q
  IMPLIES: (values: boolean[]): boolean => !(values[0] && !values[1]),
  // p <=> q
  IFF: (values: boolean[]): boolean => values[0] === values[1],
}