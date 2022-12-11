import {readFileSync} from 'fs';
import {resolve} from 'path';
import {
  Coords,
  GridBoundary,
  GridKey,
  Tree,
  TreeHeight,
  TreeVisibilityModel,
} from './models';

export const makeGridKey = (row: number, column: number): GridKey =>
  `${row}:${column}`;
export const getCoordsFromGridKey = (key: GridKey): Coords => {
  const [row, column] = key.split(':').map(Number);
  return {
    row,
    column,
  };
};

export const makeTree = (
  gridKey: GridKey,
  cellValue: string,
  isAtEdge: boolean
): Tree => {
  const coords = getCoordsFromGridKey(gridKey);
  const height = +cellValue as TreeHeight;
  return {
    height,
    coords,
    isAtEdge,
  };
};

export const getRawFileData = (): string => {
  const rawFileData = readFileSync(resolve(__dirname, './tree-grid.txt'));
  return rawFileData.toString();
};

interface IsAtEdgeParams extends GridBoundary {
  readonly x: number;
  readonly y: number;
}
export const getIsAtEdge = ({
  x,
  y,
  xMin,
  xMax,
  yMin,
  yMax,
}: IsAtEdgeParams): boolean => {
  if (x < xMin || y < yMin || x > xMax || y > yMax) {
    throw new Error('Coordinates must not be out of grid boundary');
  }
  if (x === xMin || x === xMax) return true;
  if (y === yMin || y === yMax) return true;
  return false;
};

export interface GetTreeMapAndGridBoundaryResult {
  treeMap: Map<GridKey, Tree>;
  gridBoundary: GridBoundary;
}

export const getTreeMapAndGridBoundary = (
  rawFileData: string
): GetTreeMapAndGridBoundaryResult => {
  console.time('getTreeMapAndGridBoundary');
  const treeMap = new Map<GridKey, Tree>();
  const rows = rawFileData.split('\n').filter(x => !!x);
  const xMin = 0;
  const xMax = rows[0].length - 1;
  const yMin = 0;
  const yMax = rows.length - 1;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    for (let j = 0; j < row.length; j++) {
      const cellValue = row[j];
      const gridKey = makeGridKey(i, j);
      const isAtEdge = getIsAtEdge({
        x: j,
        y: i,
        xMin,
        xMax,
        yMin,
        yMax,
      });
      const tree = makeTree(gridKey, cellValue, isAtEdge);
      treeMap.set(gridKey, tree);
    }
  }
  console.timeEnd('getTreeMapAndGridBoundary');
  return {
    treeMap,
    gridBoundary: {
      xMin,
      xMax,
      yMin,
      yMax,
    },
  };
};

export const calculateVerticalVisibility = (
  treeMap: ReadonlyMap<GridKey, Tree>,
  tree: Tree,
  yMin: number,
  yMax: number
): {
  isVisibleFromTop: boolean;
  isVisibleFromBottom: boolean;
} => {
  const {row, column} = tree.coords;
  const {height: compHeight} = tree;
  let isVisibleFromTop = true;
  let isVisibleFromBottom = true;
  for (let i = yMin; i <= yMax; i++) {
    const belowTree = i < row;
    if (belowTree && isVisibleFromBottom === false) continue;
    const aboveTree = i > row;
    if (aboveTree && isVisibleFromTop === false) continue;
    const atTree = i === row;
    const currentGridKey = makeGridKey(i, column);
    const currentTree = treeMap.get(currentGridKey);
    if (currentTree === undefined) {
      throw new Error(`Couldn't find current tree in tree map. Coords: ${currentGridKey}`);
    }
    if (atTree && currentTree.isAtEdge) {
      isVisibleFromBottom = i === yMin;
      isVisibleFromTop = i === yMax;
      return {isVisibleFromBottom, isVisibleFromTop};
    }
    if (belowTree) {
      isVisibleFromBottom = compHeight > currentTree.height;
    }
    if (aboveTree) {
      isVisibleFromTop = compHeight > currentTree.height;
    }
  }
  return {isVisibleFromBottom, isVisibleFromTop};
}

export const calculateHorizontalVisibility = (
  treeMap: ReadonlyMap<GridKey, Tree>,
  tree: Tree,
  xMin: number,
  xMax: number
): {
  isVisibleFromLeft: boolean;
  isVisibleFromRight: boolean;
} => {
  const {row, column} = tree.coords;
  const {height: compHeight} = tree;
  let isVisibleFromLeft = true;
  let isVisibleFromRight = true;
  for (let i = xMin; i <= xMax; i++) {
    const leftOfTree = i < column;
    if (leftOfTree && isVisibleFromLeft === false) continue;
    const rightOfTree = i > column;
    if (rightOfTree && isVisibleFromRight === false) continue;
    const atTree = i === column;
    const currentGridKey = makeGridKey(row, i);
    const currentTree = treeMap.get(currentGridKey);
    if (currentTree === undefined) {
      throw new Error(`Couldn't find current tree in tree map. Coords: ${currentGridKey}`);
    }
    if (atTree && currentTree.isAtEdge) {
      isVisibleFromLeft = i === xMin;
      isVisibleFromRight = i === xMax;
      return {isVisibleFromLeft, isVisibleFromRight};
    }
    if (leftOfTree) {
      isVisibleFromLeft = compHeight > currentTree.height;
    }
    if (rightOfTree) {
      isVisibleFromRight = compHeight > currentTree.height;
    }
  }
  return {isVisibleFromLeft, isVisibleFromRight};
}

export const getTreeVisibilityModelMap = (
  treeMap: ReadonlyMap<GridKey, Tree>,
  {yMin,yMax,xMin,xMax}: GridBoundary
): ReadonlyMap<GridKey, TreeVisibilityModel> => {
  console.time('getTreeVisibilityModelMap');
  const treeVisibilityModelMap = new Map<GridKey, TreeVisibilityModel>();
  treeMap.forEach((tree, key) => {
    const {
      isVisibleFromBottom,
      isVisibleFromTop
    } = calculateVerticalVisibility(treeMap, tree, yMin, yMax);
    const {
      isVisibleFromLeft,
      isVisibleFromRight
    } = calculateHorizontalVisibility(treeMap, tree, xMin, xMax);
    treeVisibilityModelMap.set(key, {
      ...tree,
      isVisibleFromTop,
      isVisibleFromLeft,
      isVisibleFromBottom,
      isVisibleFromRight
    });
  });
  console.timeEnd('getTreeVisibilityModelMap');
  return treeVisibilityModelMap;
};

export const getVisibleTreesCount = (
  treeVisibilityModelMap: ReadonlyMap<GridKey, TreeVisibilityModel>,
  countType: 'edge-only' | 'interior-only' | 'all'
): number => {
  console.time('getVisibleTreesCount');
  let visibleTreesCount = 0;
  treeVisibilityModelMap.forEach(({
    isVisibleFromTop,
    isVisibleFromLeft,
    isVisibleFromBottom,
    isVisibleFromRight,
    isAtEdge
  }) => {
    if (countType === 'interior-only' && isAtEdge) return;
    if (countType === 'edge-only' && isAtEdge === false) return;
    if (
      isVisibleFromTop
      || isVisibleFromRight
      || isVisibleFromBottom
      || isVisibleFromLeft
    ) {
      visibleTreesCount++;
    }
  });
  console.timeEnd('getVisibleTreesCount');
  return visibleTreesCount;
}
