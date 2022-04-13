import { ORIGIN, Vector2 } from '@TRE/math'
import { Point } from '@TRE/primitive'
import { GeometricalTests, ORIENT } from '@TRE/primitive-tests'
import { expect } from 'chai'

describe('GeometricalTests', () => {
  describe('#orient2d', () => {
    it('should be collinear', () => {
      const p1 = new Vector2(0, 0)
      const p2 = new Vector2(1, 1)
      const p3 = new Vector2(2, 2)
      expect(GeometricalTests.orient2d(p1, p2, p3)).to.equal(ORIENT.COLLINEAR)
    })

    it('should be return correct orientation', () => {
      const p1 = new Vector2(-1, -1)
      const p2 = new Vector2(-5, -5)
      const p3 = new Vector2(-2, -8)
      expect(GeometricalTests.orient2d(p1, p2, p3)).to.equal(ORIENT.COUNTERCLOCKWISE)
      expect(GeometricalTests.orient2d(p1, p3, p2)).to.equal(ORIENT.CLOCKWISE)
    })

    it('should be return correct orientation', () => {
      const p1 = new Vector2(1, 1)
      const p2 = new Vector2(5, 5)
      const p3 = new Vector2(2, 8)
      expect(GeometricalTests.orient2d(p1, p2, p3)).to.equal(ORIENT.COUNTERCLOCKWISE)
      expect(GeometricalTests.orient2d(p1, p3, p2)).to.equal(ORIENT.CLOCKWISE)
    })
  })

  describe('#isCollinear', () => {
    it('should be collinear', () => {
      const p1 = new Point(1, 1, 1)
      const p2 = new Point(2, 2, 2)
      const isCollinear = GeometricalTests.isCollinear(ORIGIN, p1, p2)
      expect(isCollinear).to.be.true
    })

    it('should be collinear with tolerance', () => {
      const p1 = new Point(1, 1, 1)
      const p2 = new Point(2.0001, 2.0001, 2.0001)
      const isCollinear = GeometricalTests.isCollinear(ORIGIN, p1, p2)
      expect(isCollinear).to.be.true
    })

    it('should be collinear (irrelerant of the order of the given points)', () => {
      const p1 = new Point(1, 1, 1)
      const p2 = new Point(-2, -2, -2)
      const isCollinear = GeometricalTests.isCollinear(ORIGIN, p1, p2)
      expect(isCollinear).to.be.true
    })

    it('should not be collinear', () => {
      const p1 = new Point(1, 1, 1)
      const p2 = new Point(2, 3, 4)
      const isCollinear = GeometricalTests.isCollinear(ORIGIN, p1, p2)
      expect(isCollinear).to.be.false
    })
  })
})
