import { expect } from 'chai';
import { getIO } from '../functions';
import { main } from '../index';
import { ICmdOutput } from '../models';

describe(`Test`, () => {
  it(`shouldn't blow up`, () => {
    expect(main()).to.equal(0);
  });
  describe(`getIO`, () => {
    it(`should get cmd io as an output with files`, () => {
      const actual = getIO(false, '1234 test.cpp') as ICmdOutput;
      expect(1234).to.equal(actual.file?.size);
      expect('test.cpp').to.equal(actual.file?.name);
    });
  });
});
