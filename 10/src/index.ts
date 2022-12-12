import {readFileSync} from 'fs';
import {resolve} from 'path';

interface Cycle {
  readonly instruction: `noop` | `addx ${number}` | 'processing';
  readonly X: number;
}

export const main = (): number => {
  const rawFileData = readFileSync(resolve(__dirname, './instructions.txt'));
  const parsedData = rawFileData
    .toString()
    .split('\n')
    .filter(x => !!x);
  const cycles: Cycle[] = [];
  let xRegister = 1;
  // add cycles to make this stuff a little easier
  for (let i = 0; i < parsedData.length; i++) {
    const instruction = parsedData[i];
    if (instruction === 'noop') {
      cycles.push({
        instruction,
        X: xRegister,
      });
      continue;
    }
    // there are only noops and adds
    cycles.push({
      instruction: 'processing',
      X: xRegister,
    });
    const numberToAdd = +instruction.split(' ')[1];
    if (typeof numberToAdd !== 'number' || isNaN(numberToAdd)) {
      throw new Error(`Unexpected input`);
    }
    cycles.push({
      instruction: instruction as `addx ${number}`,
      X: xRegister,
    });
    xRegister += numberToAdd;
  }
  const cyclesToSum = [20, 60, 100, 140, 180, 220];
  const sixSignalStrengthSum = cyclesToSum.reduce((acc, curr) => {
    console.log({acc, curr, cycle: cycles[curr - 1]});
    return (acc += cycles[curr-1].X * curr);
  }, 0);
  console.log(sixSignalStrengthSum);
  return 0;
};

// for node runs
main();

// try 14420 after 7:45
