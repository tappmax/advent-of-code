import { expect } from 'chai';
import { testFunction } from '..';

describe(`Day 4`, () => {
  it(`should return 'testing'`, () => {
    const test = testFunction();
    expect(test).to.equal('testing');
  });
});
