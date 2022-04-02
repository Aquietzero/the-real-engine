import VectorsExample from './math/vectors'
import ConnectedVectorsExample from './math/connected-vectors'
import MatrixTransformationsExample from './math/matrix-transformations'
import ObjTransformationsExample from './math/obj-transformations'

import AABBOfPointsExample from './bounding-volumes/aabb-of-points'

export default {
  'math': {
    VectorsExample,
    ConnectedVectorsExample,
    MatrixTransformationsExample,
    ObjTransformationsExample,
  } as any,
  'bounding-volumes': {
    AABBOfPointsExample,
  } as any,
}
