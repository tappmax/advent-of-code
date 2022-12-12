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
  let drawing = '';
  let monitorColumn = 0;
  const darkPixel = '.';
  const lightPixel = '#';
  for (let i = 0; i < cycles.length; i++) {
    const {X} = cycles[i];
    const sprite = [Math.max(X-1, 0), X, Math.min(X + 1, cycles.length)];
    const isSpriteByPixel = sprite.includes(monitorColumn);
    drawing += isSpriteByPixel ? lightPixel : darkPixel;
    monitorColumn++;
    if (monitorColumn % 40 === 0) {
      drawing += '\n';
      monitorColumn = 0;
    }
  }
  console.log(drawing);
  return 0;
};

// for node runs
main();
