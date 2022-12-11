
/** row:column */
export type GridKey = `${number}:${number}`;

/** 0 is shorted, 9 is tallest */
export type TreeHeight = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface Coords {
  readonly row: number;
  readonly column: number;
}

export interface Tree {
  readonly height: TreeHeight;
  readonly coords: Coords;
  readonly isAtEdge: boolean;
}

export interface TreeVisibilityModel extends Tree {
  readonly isVisibleFromTop: boolean;
  readonly isVisibleFromRight: boolean;
  readonly isVisibleFromBottom: boolean;
  readonly isVisibleFromLeft: boolean;
}
