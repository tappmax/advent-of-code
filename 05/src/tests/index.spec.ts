import {expect} from 'chai';
import {
  getContainerAtPosition,
  initializeContainerMap,
  moveStacks,
} from '../index';

describe(`index`, () => {
  describe(`getContainerAtPosition`, () => {
    it(`should return the proper container`, () => {
      const input = '[F] [G] [H] [Z] [N] [P] [M] [N] [D]';
      const expectedResults = [
        [1, 'F'],
        [2, 'G'],
        [3, 'H'],
        [4, 'Z'],
        [5, 'N'],
        [6, 'P'],
        [7, 'M'],
        [8, 'N'],
        [9, 'D'],
      ];
      expectedResults.forEach(([position, expectedResult]) => {
        expect(getContainerAtPosition(input, +position)).to.equal(
          expectedResult
        );
      });
    });
  });
  describe(`initializeContainerMap`, () => {
    it(`should return the proper container`, () => {
      const input = [
        '    [H]         [D]     [P]        ',
        '[W] [B]         [C] [Z] [D]        ',
        '[T] [J]     [T] [J] [D] [J]        ',
        '[H] [Z]     [H] [H] [W] [S]     [M]',
        '[P] [F] [R] [P] [Z] [F] [W]     [F]',
        '[J] [V] [T] [N] [F] [G] [Z] [S] [S]',
        '[C] [R] [P] [S] [V] [M] [V] [D] [Z]',
        '[F] [G] [H] [Z] [N] [P] [M] [N] [D]',
        '1   2   3   4   5   6   7   8   9 ',
      ];
      const expectedResults = JSON.stringify([
        ['F', 'C', 'J', 'P', 'H', 'T', 'W'],
        ['G', 'R', 'V', 'F', 'Z', 'J', 'B', 'H'],
        ['H', 'P', 'T', 'R'],
        ['Z', 'S', 'N', 'P', 'H', 'T'],
        ['N', 'V', 'F', 'Z', 'H', 'J', 'C', 'D'],
        ['P', 'M', 'G', 'F', 'W', 'D', 'Z'],
        ['M', 'V', 'Z', 'W', 'S', 'J', 'D', 'P'],
        ['N', 'D', 'S'],
        ['D', 'Z', 'S', 'F', 'M'],
      ]);
      const containerData = JSON.stringify([
        ...initializeContainerMap(input).values(),
      ]);
      console.log({expectedResults, containerData});
      expect(containerData).to.equal(expectedResults);
    });
  });
  describe(`moveStacks`, () => {
    it(`should move stack and retain original order`, () => {
      const map = new Map<number, string[]>([
        [1, ['A', 'B', 'C']],
        [2, ['D', 'E', 'F']],
      ]);
      moveStacks(2, 1, 2, map);
      const expectedStackOne = 'A';
      const expectedStackTwo = 'DEFBC';
      const actualStackOne = map.get(1)?.join('');
      const actualStackTwo = map.get(2)?.join('');
      expect(expectedStackOne).to.equal(actualStackOne);
      expect(expectedStackTwo).to.equal(actualStackTwo);
    });
  });
});
