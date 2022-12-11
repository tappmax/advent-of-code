import {
  getCmdIOFromFile,
  getHydratedDirectoryMap,
} from './functions';

const ReportableSizeThreshold = 100000;

export const main = (): number => {
  const directoryMap = getHydratedDirectoryMap(getCmdIOFromFile());
  
  return 0;
};

// for node runs
main();
