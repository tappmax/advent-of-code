import {readFileSync} from 'fs';
import {resolve} from 'path';

export const isNullOrUndefinedOrWhitespace = (value: unknown): boolean => {
  if (value === null) return true;
  if (value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  return false;
};

export const getContainerAtPosition = (
  row: string,
  position: number
): string => {
  // each column is 4 characters, open bracket, the contents, close bracket, and a space.
  const startIndex = (position - 1) * 4;
  return row.charAt(startIndex + 1);
};

export const initializeContainerMap = (
  containerData: string[]
): Map<number, string[]> => {
  const container = new Map<number, string[]>([
    [1, []],
    [2, []],
    [3, []],
    [4, []],
    [5, []],
    [6, []],
    [7, []],
    [8, []],
    [9, []],
  ]);
  // for each row starting at the bottom, go through each column and add the letters
  // the last row is just their identifiers, we don't care about it.
  for (let i = containerData.length - 2; i >= 0; i--) {
    const row = containerData[i];
    // uh oh.. a nested loop... I guess this is ok
    for (let col = 1; col <= 9; col++) {
      const containerContent = getContainerAtPosition(row, col);
      if (isNullOrUndefinedOrWhitespace(containerContent)) {
        continue;
      }
      const colFromContainer = container.get(col) as string[];
      colFromContainer.push(containerContent);
    }
  }
  return container;
};

export const moveOneByOne = (
  moveAmount: number,
  fromCol: number,
  toCol: number,
  containerMap: Map<number, string[]>
): void => {
  const fromStack = containerMap.get(fromCol) as string[];
  const toStack = containerMap.get(toCol) as string[];
  for (let i = 0; i < moveAmount; i++) {
    const poppedContent = fromStack.pop();
    if (typeof poppedContent !== 'string') {
      throw new Error(
        `columns can only container strings, received ${typeof poppedContent}`
      );
    }
    toStack.push(poppedContent);
  }
};

export const moveStacks = (
  moveAmount: number,
  fromCol: number,
  toCol: number,
  containerMap: Map<number, string[]>
): void => {
  const fromStack = containerMap.get(fromCol) as string[];
  const toStack = containerMap.get(toCol) as string[];
  const fromStackEndIndex = fromStack.length - 1;
  const newFromStackEndIndex = fromStackEndIndex - moveAmount;
  // splice mutates the OG array
  const moveStack = fromStack.splice(newFromStackEndIndex + 1, moveAmount);
  const newToStack = [...toStack, ...moveStack];
  containerMap.set(toCol, newToStack);
};

export const rearrangeStacks = (
  instructions: string[],
  containerMap: Map<number, string[]>
): Map<number, string[]> => {
  instructions.forEach(instruction => {
    // we're skipping the english words and grabbing the numbers
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, moveAmount, __, fromCol, ___, toCol] = instruction.split(' ');
    moveStacks(+moveAmount, +fromCol, +toCol, containerMap);
  });
  return containerMap;
};

export const main = (): string => {
  // read in the file
  const rawFileData = readFileSync(
    resolve(__dirname, './rearrange-procedure.txt')
  );
  // preliminary parse - we separate the newline that separates the instructions from the container setup
  const [containerData, underscoreSeparatedRearrangeInstructionData] =
    rawFileData.toString().split('\n').join('_').split('__');
  const rearrangeInstructions = underscoreSeparatedRearrangeInstructionData
    .split('_')
    .filter(x => !!x);
  // we've looked at the file, so its kinda like cheating.. but whatever
  const containerMap = initializeContainerMap(containerData.split('_'));
  rearrangeStacks(rearrangeInstructions, containerMap);
  // After the rearrangement procedure completes, what crate ends up on top of each stack?
  const topOfStack: string[] = [];
  for (let i = 1; i <= containerMap.size; i++) {
    const stack = containerMap.get(i) as string[];
    const lastThing = stack[stack.length - 1];
    topOfStack.push(lastThing);
  }
  console.log(topOfStack.join(''));
  return topOfStack.join('');
};

// for node runs
main();
