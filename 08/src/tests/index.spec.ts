/* eslint-disable @typescript-eslint/no-non-null-assertion */

import {expect} from 'chai';
import {
  calculateHorizontalVisibility,
  getBestSpotForTheTreeHouseBasedOnScenicScore,
  getTreeMapAndGridBoundary,
  getTreeScenicScoreMap,
  getTreeVisibilityModelMap,
  getVisibleTreesCount,
} from '../functions';
import {main} from '../index';

describe(`Test`, () => {
  it(`shouldn't blow up`, () => {
    expect(main()).to.equal(0);
  });
  const testInput =
    '' + '30373\n' + '25512\n' + '65332\n' + '33549\n' + '35390\n';
  ('\n');
  describe(`getTreeMapAndGridBoundary`, () => {
    const {treeMap, gridBoundary} = getTreeMapAndGridBoundary(testInput);
    it(`should put the expected heights in the expected spots`, () => {
      expect(treeMap.get(`${0}:${0}`)?.height).to.equal(3);
      expect(treeMap.get(`${1}:${0}`)?.height).to.equal(2);
      expect(treeMap.get(`${4}:${4}`)?.height).to.equal(0);
      expect(treeMap.get(`${3}:${3}`)?.height).to.equal(4);
    });
    it(`should correctly calculate edge trees`, () => {
      expect(treeMap.get(`${0}:${0}`)?.isAtEdge).to.equal(true);
      expect(treeMap.get(`${0}:${4}`)?.isAtEdge).to.equal(true);
      expect(treeMap.get(`${1}:${1}`)?.isAtEdge).to.equal(false);
      expect(treeMap.get(`${4}:${4}`)?.isAtEdge).to.equal(true);
      expect(treeMap.get(`${3}:${3}`)?.isAtEdge).to.equal(false);
    });
    it(`should have the correct coordinates`, () => {
      expect(treeMap.get(`${3}:${3}`)?.coords.column).to.equal(3);
      expect(treeMap.get(`${3}:${3}`)?.coords.row).to.equal(3);
      expect(treeMap.get(`${0}:${0}`)?.coords.column).to.equal(0);
      expect(treeMap.get(`${0}:${0}`)?.coords.row).to.equal(0);
      expect(treeMap.get(`${4}:${3}`)?.coords.column).to.equal(3);
      expect(treeMap.get(`${4}:${3}`)?.coords.row).to.equal(4);
    });
    it(`should calculate correct grid boundary`, () => {
      const {yMin, yMax, xMin, xMax} = gridBoundary;
      expect(yMin).to.equal(0);
      expect(yMax).to.equal(4);
      expect(xMin).to.equal(0);
      expect(xMax).to.equal(4);
    });
  });
  describe(`visibility stuff`, () => {
    const {treeMap, gridBoundary} = getTreeMapAndGridBoundary(testInput);
    it(`should calculate horizontal visibility`, () => {
      let tree = treeMap.get(`${0}:${0}`)!;
      const {isVisibleFromLeft: edgeLeft, isVisibleFromRight: edgeRight} =
        calculateHorizontalVisibility(treeMap, tree, 0, 4);
      expect(true).to.equal(edgeLeft);
      expect(false).to.equal(edgeRight);
      tree = treeMap.get(`${1}:${1}`)!;
      const {
        isVisibleFromLeft: insideTopLeftLeft,
        isVisibleFromRight: insideTopLeftRight,
      } = calculateHorizontalVisibility(treeMap, tree, 0, 4);
      expect(true).to.equal(insideTopLeftLeft);
      expect(false).to.equal(insideTopLeftRight);
      tree = treeMap.get(`${2}:${1}`)!;
      const {
        isVisibleFromLeft: middleInsideLeft,
        isVisibleFromRight: middleInsideRight,
      } = calculateHorizontalVisibility(treeMap, tree, 0, 4);
      console.log({tree, middleInsideLeft, middleInsideRight});
      expect(false).to.equal(middleInsideLeft);
      expect(true).to.equal(middleInsideRight);
    });
    it(`should calculate all visibility sum`, () => {
      const visMap = getTreeVisibilityModelMap(treeMap, gridBoundary);
      const visSum = getVisibleTreesCount(visMap, 'all');
      expect(21).to.equal(visSum);
    });
    it(`should calculate edge visibility sum`, () => {
      const visMap = getTreeVisibilityModelMap(treeMap, gridBoundary);
      const visSum = getVisibleTreesCount(visMap, 'edge-only');
      expect(16).to.equal(visSum);
    });
    it(`should calculate interior visibility sum`, () => {
      const visMap = getTreeVisibilityModelMap(treeMap, gridBoundary);
      const visSum = getVisibleTreesCount(visMap, 'interior-only');
      expect(5).to.equal(visSum);
    });
  });
  describe(`scenic trees`, () => {
    const {treeMap, gridBoundary} = getTreeMapAndGridBoundary(testInput);
    const treeVisibilityModelMap = getTreeScenicScoreMap(treeMap, gridBoundary);
    it(`find the best tree`, () => {
      const bestTree = getBestSpotForTheTreeHouseBasedOnScenicScore(
        treeVisibilityModelMap
      );
      expect(8).to.equal(bestTree.scenicScore);
    });
  });
});
