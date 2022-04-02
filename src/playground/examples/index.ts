import VectorsExample from './math/vectors'
import ConnectedVectorsExample from './math/connected-vectors'
import MatrixTransformationsExample from './math/matrix-transformations'
import ObjTransformationsExample from './math/obj-transformations'

import AABBExample from './bounding-volumes/aabb'

export default {
  'math': {
    VectorsExample,
    ConnectedVectorsExample,
    MatrixTransformationsExample,
    ObjTransformationsExample,
  } as any,
  'bounding-volumes': {
    AABBExample,
  } as any,
}
