import { resolve } from 'path';
import { readFileSync } from 'fs';

const getInputAsString = (): string => {
  // read in the file
  const rawFileData = readFileSync(
    resolve(__dirname, './buffer.txt')
  );
  // preliminary parse - we separate the newline that separates the instructions from the container setup
  return rawFileData.toString()
}

export const findStartOfPacket = (buffer: string): number => {
  // skip to the 4th position in the array
  for (let i = 3; i < buffer.length; i++) {
    const characterSet = new Set([
      buffer[i],
      buffer[i-1],
      buffer[i-2],
      buffer[i-3],
    ]);
    if (characterSet.size === 4) {
      return i + 1;
    }
  }
  throw new Error('No marker found');
};

export const partTwo = (buffer: string): number => {
  // skip to the 14th position in the array
  for (let i = 13; i < buffer.length; i++) {
    const characterSet = new Set();
    for (let j = 13; j >= 0; j--) {
      characterSet.add(buffer[i - j]);
    }
    if (characterSet.size === 14) {
      return i + 1;
    }
  }
  throw new Error('No marker found');
};

export const main = (): number => {
  const buffer = getInputAsString();
  console.log(partTwo(buffer));
  return 0;
}

// for node runs
main();
