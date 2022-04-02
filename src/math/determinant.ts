// Calculates the determinant of given matrices
export class Determinant {
  public static ofMatrix2x2(es: number[]): number {
    // | 0 1 |
    // | 2 3 |
    return es[0]*es[3] - es[1]*es[2]
  }

  public static ofMatrix3x3(es: number[]): number {
    // | 0 1 2 |        d0          d1          d2
    // | 3 4 5 | = 0x| 4 5 | - 1x| 3 5 | + 2x| 3 4 |
    // | 6 7 8 |     | 7 8 |     | 6 8 |     | 6 7 |
    const d0 = Determinant.ofMatrix2x2([
      es[4], es[5],
      es[7], es[8],
    ])
    const d1 = Determinant.ofMatrix2x2([
      es[3], es[5],
      es[6], es[8],
    ])
    const d2 = Determinant.ofMatrix2x2([
      es[3], es[4],
      es[6], es[7],
    ])
    return es[0]*d0 - es[1]*d1 + es[2]*d2
  }

  public static ofMatrix4x4(es: number[]): number {
    // |  0  1  2  3 |          d0               d1               d2               d3
    // |  4  5  6  7 | = 0x|  5  6  7 | - 1x|  4  6  7 | + 2x|  4  5  7 | - 3x|  4  5  6 |
    // |  8  9 10 11 |     |  9 10 11 |     |  8 10 11 |     |  8  9 11 |     |  8  9 10 |
    // | 12 13 14 15 |     | 13 14 15 |     | 12 14 15 |     | 12 13 15 |     | 12 13 14 |
    const d0 = Determinant.ofMatrix3x3([
      es[5], es[6], es[7],
      es[9], es[10], es[11],
      es[13], es[14], es[15],
    ])
    const d1 = Determinant.ofMatrix3x3([
      es[4], es[6], es[7],
      es[8], es[10], es[11],
      es[12], es[14], es[15],
    ])
    const d2 = Determinant.ofMatrix3x3([
      es[4], es[5], es[7],
      es[8], es[9], es[11],
      es[12], es[13], es[15],
    ])
    const d3 = Determinant.ofMatrix3x3([
      es[4], es[5], es[6],
      es[8], es[9], es[10],
      es[12], es[13], es[14],
    ])

    return es[0]*d0 - es[1]*d1 + es[2]*d2 - es[3]*d3
  }
}
