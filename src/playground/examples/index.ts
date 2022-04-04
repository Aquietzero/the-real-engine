import VectorsExample from './math/vectors'
import ConnectedVectorsExample from './math/connected-vectors'
import MatrixTransformationsExample from './math/matrix-transformations'
import ObjTransformationsExample from './math/obj-transformations'

import AABBOfPointsExample from './bounding-volumes/aabb-of-points'
import AABBOfObjExample from './bounding-volumes/aabb-of-obj'
import SphereOfPointsExample from './bounding-volumes/sphere-of-points'
import SphereOfObjExample from './bounding-volumes/sphere-of-obj'

import ClosestPointOnPlaneExample from './primitive-tests/closest-point-on-plane'
import ClosestPointOnSegmentExample from './primitive-tests/closest-point-on-segment'
import ClosestPointOnAABBExample from './primitive-tests/closest-point-on-aabb'
import ClosestPointOnTriangleExample from './primitive-tests/closest-point-on-triangle'
import ClosestPointsBetweenLinesExample from './primitive-tests/closest-points-between-lines'

import TestingSphereAgainstPlaneExample from './primitive-tests/testing-sphere-against-plane'
import TestingAABBAgainstPlaneExample from './primitive-tests/testing-aabb-against-plane'
import TestingSphereAgainstAABBExample from './primitive-tests/testing-sphere-against-aabb'
import TestingSphereAgainstTriangleExample from './primitive-tests/testing-sphere-against-triangle'
import TestingAABBAgainstTriangleExample from './primitive-tests/testing-aabb-against-triangle'

import IntersectionOfSegmentAndPlaneExample from './primitive-tests/intersection-of-segment-and-plane'
import IntersectionOfRayAndSphereExample from './primitive-tests/intersection-of-ray-and-sphere'
import IntersectionOfRayAndAABBExample from './primitive-tests/intersection-of-ray-and-aabb'

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
  'primitive-tests': {
    ClosestPointOnPlaneExample,
    ClosestPointOnSegmentExample,
    ClosestPointOnAABBExample,
    ClosestPointOnTriangleExample,
    ClosestPointsBetweenLinesExample,

    TestingSphereAgainstPlaneExample,
    TestingAABBAgainstPlaneExample,
    TestingSphereAgainstAABBExample,
    TestingSphereAgainstTriangleExample,
    TestingAABBAgainstTriangleExample,

    IntersectionOfSegmentAndPlaneExample,
    IntersectionOfRayAndSphereExample,
    IntersectionOfRayAndAABBExample,
  }
}
