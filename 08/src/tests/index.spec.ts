import { expect } from 'chai';
import { getTreeMap } from '../functions';
import { main } from '../index';

describe(`Test`, () => {
  it(`shouldn't blow up`, () => {
    expect(main()).to.equal(0);
  });
  const testInput = ''+
  '30373\n'+
  '25512\n'+
  '65332\n'+
  '33549\n'+
  '35390\n';
  '\n';
  it(`should read into a Map as Tree types`, () => {
    const treeMap = getTreeMap(testInput);
    expect(treeMap.get(`${0}:${0}`)?.height).to.equal(3);
  });
});
