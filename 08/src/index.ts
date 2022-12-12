import {
  getBestSpotForTheTreeHouseBasedOnScenicScore,
  getRawFileData,
  getTreeMapAndGridBoundary,
  getTreeScenicScoreMap,
} from './functions';

export const main = (): number => {
  console.time('main');
  const {treeMap, gridBoundary} = getTreeMapAndGridBoundary(getRawFileData());
  const treeVisibilityModelMap = getTreeScenicScoreMap(treeMap, gridBoundary);
  const bestTree = getBestSpotForTheTreeHouseBasedOnScenicScore(
    treeVisibilityModelMap
  );
  console.log(bestTree.scenicScore);
  console.timeEnd('main');
  return 0;
};

// for node runs
main();
