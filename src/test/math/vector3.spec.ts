import { Vector3 } from '@TRE/math'
import { expect } from 'chai'

describe('Vector3', () => {
  describe('#constructor', () => {
    it('should construct a 3d vector with default values.', () => {
      const v = new Vector3()
      expect(v.x).to.equal(0)
      expect(v.y).to.equal(0)
      expect(v.z).to.equal(0)
    })

    it('should construct a 3d vector with given values.', () => {
      const v = new Vector3(1, 2, 3)
      expect(v.x).to.equal(1)
      expect(v.y).to.equal(2)
      expect(v.z).to.equal(3)
    })
  })

  describe('#add', () => {
    it('should add a given vector correctly and return the result as a new vector.', () => {
      const v1 = new Vector3(1, 2, 3)
      const v2 = new Vector3(2, 3, 4)
      const res = v1.add(v2)
      expect(res.x).to.equal(3)
      expect(res.y).to.equal(5)
      expect(res.z).to.equal(7)
    })
  })

  describe('#sub', () => {
    it('should subtract a given vector correctly and return the result as a new vector.', () => {
      const v1 = new Vector3(1, 2, 3)
      const v2 = new Vector3(2, 3, 4)
      const res = v1.sub(v2)
      expect(res.x).to.equal(-1)
      expect(res.y).to.equal(-1)
      expect(res.z).to.equal(-1)
    })
  })

  describe('#mul', () => {
    it('should multiply a given scalar correctly and return the result as a new vector.', () => {
      const v1 = new Vector3(1, 2, 3)
      const res = v1.mul(2)
      expect(res.x).to.equal(2)
      expect(res.y).to.equal(4)
      expect(res.z).to.equal(6)
    })
  })

  describe('#div', () => {
    it('should divide a given scalar correctly and return the result as a new vector.', () => {
      const v1 = new Vector3(1, 2, 3)
      const res = v1.div(2)
      expect(res.x).to.equal(0.5)
      expect(res.y).to.equal(1)
      expect(res.z).to.equal(1.5)
    })

    it('should throw an error when being divided by 0.', () => {
      const v1 = new Vector3(1, 2, 3)
      expect(() => v1.div(0)).to.throw('[Vector3.div]: cannot divide 0')
    })
  })

  describe('#len', () => {
    it('should return the length of a vector.', () => {
      const v1 = new Vector3(3, 4, 0)
      expect(v1.len()).to.equal(5)
    })
  })

  describe('#len2', () => {
    it('should return the squared length of a vector.', () => {
      const v1 = new Vector3(1, 2, 3)
      expect(v1.len2()).to.equal(14)
    })
  })

  describe('crossProduct', () => {
    it('should return the correct cross product between two vectors.', () => {
      const x = new Vector3(1, 0, 0)
      const y = new Vector3(0, 1, 0)
      const z = new Vector3(0, 0, 1)

      const cxy = Vector3.crossProduct(x, y)
      expect(cxy.x).to.equal(0)
      expect(cxy.y).to.equal(0)
      expect(cxy.z).to.equal(1)
      expect(cxy.len()).to.equal(1)

      const czx = Vector3.crossProduct(z, x)
      expect(czx.x).to.equal(0)
      expect(czx.y).to.equal(1)
      expect(czx.z).to.equal(0)
      expect(czx.len()).to.equal(1)

      const a = new Vector3(10, 10, 10)
      console.log(Vector3.crossProduct(y, a))
    })
  })
})
