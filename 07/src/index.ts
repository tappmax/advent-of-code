import {
  getCmdIOFromFile,
  getDirectorySum,
  getHydratedDirectoryMap,
} from './functions';


export const main = (): number => {
  const directoryMap = getHydratedDirectoryMap(getCmdIOFromFile());
  const sum = getDirectorySum(directoryMap);
  console.log(sum);
  return 0;
};

// for node runs
main();
