import {
  getCmdIOFromFile,
  getHydratedDirectoryMap,
} from './functions';

const ReportableSizeThreshold = 100000;

export const main = (): number => {
  const directoryMap = getHydratedDirectoryMap(getCmdIOFromFile());
  let sum = 0;
  directoryMap.forEach((dir) => {
    const dirSize = dir.getDirectorySize();
    if (dirSize <= ReportableSizeThreshold) {
      sum += dirSize;
    }
  });
  console.log(sum);
  return 0;
};

// for node runs
main();
