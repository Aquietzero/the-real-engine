import { Vector3, ORIGIN } from '@TRE/math'
import { AABB } from '@TRE/bounding-volumes'
import { expect } from 'chai'

describe('AABB', () => {
  describe('#clamp', () => {
    it('should correctly clamp aabb.', () => {
      const aabb = new AABB(ORIGIN, new Vector3(1, 1, 1))
      const newAABB = aabb.clamp('x', 'min', -0.5)
      expect(newAABB.center.x).to.equal(0.25)
      expect(newAABB.radius.x).to.equal(0.75)
    })

    it('should not clamp the aabb if the min value is smaller than the current min.', () => {
      const aabb = new AABB(ORIGIN, new Vector3(1, 1, 1))
      const newAABB = aabb.clamp('x', 'min', -1.5)
      expect(newAABB.center.x).to.equal(0)
      expect(newAABB.radius.x).to.equal(1)
    })
  })
  describe('#mostSeparatedPoints', () => {
    it('should return the given vectors if the two given vectors are different.', () => {
      const v1 = new Vector3(0, 1, -4)
      const v2 = new Vector3(0, -2, -2)
      const { min, max } = AABB.mostSeparatedPoints([v1, v2])
      expect(min.equalTo(v1)).to.be.true
      expect(max.equalTo(v2)).to.be.true
    })

    it('should return the given vectors if the two given vectors are different.', () => {
      const v1 = new Vector3(0, 1, -4)
      const v2 = new Vector3(0, -2, -2)
      const v3 = new Vector3(0, 0, -3)
      const { min, max } = AABB.mostSeparatedPoints([v1, v2, v3])
      expect(min.equalTo(v1)).to.be.true
      expect(max.equalTo(v2)).to.be.true
    })
  })
})
