import { ORIGIN } from '@TRE/math'
import { Point } from '@TRE/primitive'
import { GeometricalTests } from '@TRE/primitive-tests'
import { expect } from 'chai'

describe('GeometricalTests', () => {
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
