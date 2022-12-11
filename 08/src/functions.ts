import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Coords, GridKey, Tree, TreeHeight } from './models';

export const makeGridKey = (row: number, column: number): GridKey => `${row}:${column}`;
export const getCoordsFromGridKey = (key: GridKey): Coords => {
  const [row, column] = key.split(':').map(Number);
  return {
    row,
    column
  };
};

export const makeTree = (gridKey: GridKey, cellValue: string, isAtEdge: boolean): Tree => {
  const coords = getCoordsFromGridKey(gridKey);
  const height = +cellValue as TreeHeight;
  return {
    height,
    coords,
    isAtEdge
  };
}

export const getRawFileData = (): string => {
  const rawFileData = readFileSync(resolve(__dirname, './cmds.txt'));
  return rawFileData.toString();
};

interface isAtEdgeParams {
  x: number, y: number, xMin: number, xMax: number, yMin: number, yMax: number
}
export const getIsAtEdge = ({
  x,
  y,
  xMin,
  xMax,
  yMin,
  yMax
}: isAtEdgeParams): boolean => {
  if (x === xMin || x === xMax) return true;
  if (y === yMin || y === yMax) return true;
  return false;
};

export const getTreeMap = (rawFileData: string): Map<GridKey, Tree> => {
  const treeMap = new Map<GridKey, Tree>();
  const rows = rawFileData.split('\n').filter(x => !!x);
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    for (let j = 0; j < row.length; j++) {
      const cellValue = row[j];
      const gridKey = makeGridKey(i, j);
      const isAtEdge = getIsAtEdge({
        x: j,
        y: i,
        xMin: 0,
        xMax: row.length - 1,
        yMin: 0,
        yMax: rows.length - 1
      });
      const tree = makeTree(gridKey, cellValue, isAtEdge)
      treeMap.set(gridKey, tree);
    }
  }
  return treeMap;
}
