import * as _ from 'lodash'
import {
  Matrix4,
  ZERO_MATRIX,
  IDENTITY_MATRIX,
} from '@TRE/math'
import { expect } from 'chai'

describe('Matrix4', () => {
  describe('#constructor', () => {
    it('should construct a 4x4 matrix with default values.', () => {
      const m = new Matrix4()
      _.times(16, i => {
        expect(m.e[i]).to.equal(0)
      })
    })

    it('should construct a 4x4 matrix with given values.', () => {
      const m = new Matrix4([
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16,
      ])
      _.times(16, i => {
        expect(m.e[i]).to.equal(i + 1)
      })
    })
  })

  describe('#equal', () => {
    it('should equals with the same matrix.', () => {
      const m = new Matrix4([
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16,
      ])
      expect(m.equals(m)).to.be.true;
    })

    it('should equals with the matrix with same elements.', () => {
      const m1 = new Matrix4([
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16,
      ])
      const m2 = new Matrix4([
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16,
      ])
      const m3 = new Matrix4([
        13, 14, 15, 16,
        9, 10, 11, 12,
        5, 6, 7, 8,
        1, 2, 3, 4,
      ])
      expect(m1.equals(m3)).to.be.false;
    })
  })

  describe('#add', () => {
    it('should equals the original matrix with addtion to zero matrix.', () => {
      const m = new Matrix4([
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16,
      ])
      expect(m.add(ZERO_MATRIX).equals(m)).to.be.true;
    })

    it('should equals the matrix with all of its elements the sum of the given two matrices.', () => {
      const m = new Matrix4([
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16,
      ])
      const sum = new Matrix4([
        2, 4, 6, 8,
        10, 12, 14, 16,
        18, 20, 22, 24,
        26, 28, 30, 32,
      ])
      expect(m.add(m).equals(sum)).to.be.true;
    })
  })

  describe('#sub', () => {
    it('should equals the original matrix with subtraction to zero matrix.', () => {
      const m = new Matrix4([
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16,
      ])
      expect(m.sub(ZERO_MATRIX).equals(m)).to.be.true;
    })

    it('should equals the matrix with all of its elements the difference of the given two matrices.', () => {
      const m = new Matrix4([
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16,
      ])
      const sum = new Matrix4([
        2, 4, 6, 8,
        10, 12, 14, 16,
        18, 20, 22, 24,
        26, 28, 30, 32,
      ])
      expect(sum.sub(m).equals(m)).to.be.true;
    })
  })

  describe('#mul', () => {
    it('should equals the original matrix with multiplication to identity matrix.', () => {
      const m = new Matrix4([
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16,
      ])
      expect(m.mul(IDENTITY_MATRIX).equals(m)).to.be.true;
    })

    it('should equals the matrix with all of its elements the difference of the given two matrices.', () => {
      const m = new Matrix4([
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16,
      ])
      const product = new Matrix4([
        90, 100, 110, 120,
        202, 228, 254, 280,
        314, 356, 398, 440,
        426, 484, 542, 600,
      ])
      expect(m.mul(m).equals(product)).to.be.true;
    })
  })
})
