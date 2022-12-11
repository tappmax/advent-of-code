import { expect } from 'chai';
import { main } from '../index';

describe(`Test`, () => {
  it(`shouldn't blow up`, () => {
    expect(main()).to.equal(0);
  });
});
