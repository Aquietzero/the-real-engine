import { Vector3 } from '@TRE/math'
import { AABB } from '@TRE/bounding-volumes'
import { expect } from 'chai'

describe('AABB', () => {
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
