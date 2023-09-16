import VectorsExample from './math/vectors'
import QuaternionsExample from './math/quaternions'
import ConnectedVectorsExample from './math/connected-vectors'
import MatrixTransformationsExample from './math/matrix-transformations'
import ObjTransformationsExample from './math/obj-transformations'
import ConvexHull2dExample from './math/convex-hull-2d'
import ConvexHull3dExample from './math/convex-hull-3d'
import SplitPolygonByPlaneExample from './math/split-polygon-by-plane'
import FurthestPointByDirectionExample from './math/furthest-point-by-direction'
import TheGJKAlgorithmExample from './math/the-gjk-algorithm'

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
import TestingSegmentAgainstAABBExample from './primitive-tests/testing-segment-against-aabb'

import IntersectionOfSegmentAndPlaneExample from './primitive-tests/intersection-of-segment-and-plane'
import IntersectionOfRayAndSphereExample from './primitive-tests/intersection-of-ray-and-sphere'
import IntersectionOfRayAndAABBExample from './primitive-tests/intersection-of-ray-and-aabb'
import IntersectionOfLineAndTriangleExample from './primitive-tests/intersection-of-line-and-triangle'
import IntersectionOfSegmentAndTriangleExample from './primitive-tests/intersection-of-segment-and-triangle'
import IntersectionOfPlaneAndPlaneExample from './primitive-tests/intersection-of-plane-and-plane'

import ClassifyPointAndPlaneExample from './primitive-tests/classify-point-and-plane'
import ClassifyPolygonAndPlaneExample from './primitive-tests/classify-polygon-and-plane'

import BVTreeExample from './bounding-volume-hierarchy/bvtree'
import KDTreeExample from './bounding-volume-hierarchy/kdtree'

import Map2DExample from './search/map-2d/map-2d'
import EightPuzzleExample from './search/eight-puzzle/eight-puzzle'

import DecisionTreeLearning from './machine-learning/decision-tree-learning'
import LinearRegression from './machine-learning/linear-regression'

import BasicRayTracer from './ray-tracer/basic-ray-tracer'

import FrozenLake from './reinforcement-learning/frozen-lake/frozen-lake'
import FrozenLakePolicyIteration from './reinforcement-learning/frozen-lake/policy-iteration'
import BanditSlippyWorld from './reinforcement-learning/bernoulli-bandit/bandit-slippy-world'
import TwoArmedBernoulliBandit from './reinforcement-learning/bernoulli-bandit/two-armed-bandit'
import NArmedBernoulliBandit from './reinforcement-learning/bernoulli-bandit/n-armed-bandit'
import StateValueEvaluation from './reinforcement-learning/random-walk/state-value-evaluation'

export default {
  math: {
    VectorsExample,
    QuaternionsExample,
    ConnectedVectorsExample,
    MatrixTransformationsExample,
    ObjTransformationsExample,
    ConvexHull2dExample,
    ConvexHull3dExample,
    SplitPolygonByPlaneExample,
    FurthestPointByDirectionExample,
    TheGJKAlgorithmExample,
  },
  'bounding-volumes': {
    AABBOfPointsExample,
    AABBOfObjExample,
    SphereOfPointsExample,
    SphereOfObjExample,
  },
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
    TestingSegmentAgainstAABBExample,

    IntersectionOfSegmentAndPlaneExample,
    IntersectionOfRayAndSphereExample,
    IntersectionOfRayAndAABBExample,
    IntersectionOfLineAndTriangleExample,
    IntersectionOfSegmentAndTriangleExample,
    IntersectionOfPlaneAndPlaneExample,

    ClassifyPointAndPlaneExample,
    ClassifyPolygonAndPlaneExample,
  },
  'bounding-volume-hierarchy': {
    BVTreeExample,
    KDTreeExample,
  },
  search: {
    Map2DExample,
    EightPuzzleExample,
  },
  'machine-learning': {
    DecisionTreeLearning,
    LinearRegression,
  },
  'ray-tracer': {
    BasicRayTracer,
  },
  'reinforcement-learning': {
    FrozenLake,
    FrozenLakePolicyIteration,
    BanditSlippyWorld,
    TwoArmedBernoulliBandit,
    NArmedBernoulliBandit,
    StateValueEvaluation,
  },
}
