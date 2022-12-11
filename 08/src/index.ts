import { getRawFileData, getTreeMapAndGridBoundary, getTreeVisibilityModelMap, getVisibleTreesCount } from './functions';

export const main = (): number => {
  console.time('main');
  const {treeMap, gridBoundary} = getTreeMapAndGridBoundary(getRawFileData());
  const treeVisibilityModelMap = getTreeVisibilityModelMap(treeMap, gridBoundary);
  const visibleTreesCount = getVisibleTreesCount(treeVisibilityModelMap, 'all');
  console.log(visibleTreesCount);
  console.timeEnd('main');
  return 0;
}

// for node runs
main();
