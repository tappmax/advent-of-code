import { readFileSync } from 'fs';
import { resolve } from 'path';

export const isNullOrUndefinedOrWhitespace = (value: unknown): boolean => {
  if (value === null) return true;
  if (value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  return false;
}

export const getContainerAtPosition = (row: string, position: number): string => {
  // each column is 4 characters, open bracket, the contents, close bracket, and a space.
  const startIndex = (position - 1) * 4;
  return row.charAt(startIndex + 1);
}

export const initializeContainerMap = (containerData: string[]): Array<string[]> => {
  const container = new Array<string[]>(9).fill([]);
  // for each row starting at the bottom, go through each column and add the letters
  // the last row is just their identifiers, we don't care about it.
  for (let i = containerData.length - 2; i >= 0; i--) {
    const row = containerData[i];
    console.log({row});
    // uh oh.. a nested loop... I guess this is ok
    for (let col = 1; col <= 9; col++) {
      const containerContent = getContainerAtPosition(row, col);
      if (isNullOrUndefinedOrWhitespace(containerContent)) {
        console.log('not pushing', containerContent, 'to position', col);
        continue;
      }
      console.log('pushing', containerContent, 'to position', col);
      container[col -1].push(containerContent);
    }
  }
  // console.log({container});
  return container;
}

export const main = (): string => {
  // read in the file
  const rawFileData = readFileSync(resolve(__dirname, './rearrange-procedure.txt'));
  // preliminary parse - we separate the newline that separates the instructions from the container setup
  const [containerData, underscoreSeparatedRearrangeInstructionData] = rawFileData.toString().split('\n').join('_').split('__');
  const rearrangeInstructions = underscoreSeparatedRearrangeInstructionData.split('_');
  // we've looked at the file, so its kinda like cheating.. but whatever
  const containerMap = initializeContainerMap(containerData.split('_'));
  
  // After the rearrangement procedure completes, what crate ends up on top of each stack?
  const topOfStack: string[] = [];
  console.log(topOfStack);
  return topOfStack.join('');
}


// for node runs
main();
