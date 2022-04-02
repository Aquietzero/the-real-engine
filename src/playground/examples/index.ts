import VectorsExample from './math/vectors'
import ConnectedVectorsExample from './math/connected-vectors'
import MatrixTransformationsExample from './math/matrix-transformations'
import ObjTransformationsExample from './math/obj-transformations'

import AABBOfPointsExample from './bounding-volumes/aabb-of-points'
import AABBOfObjExample from './bounding-volumes/aabb-of-obj'
import SphereOfPointsExample from './bounding-volumes/sphere-of-points'
import SphereOfObjExample from './bounding-volumes/sphere-of-obj'

export default {
  'math': {
    VectorsExample,
    ConnectedVectorsExample,
    MatrixTransformationsExample,
    ObjTransformationsExample,
  } as any,
  'bounding-volumes': {
    AABBOfPointsExample,
    AABBOfObjExample,
    SphereOfPointsExample,
    SphereOfObjExample,
  } as any,
}
