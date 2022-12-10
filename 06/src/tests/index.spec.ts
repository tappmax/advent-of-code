import { expect } from 'chai';
import { findStartOfPacket, main } from '../index';

describe(`06`, () => {
  it(`shouldn't blow up`, () => {
    expect(main()).to.equal(0);
  });
  describe(`findStartOfPacket`, () => {
    it(`should find the first time a marker appears`, () => {
      const buffer = 'mjqjpqmgbljsphdztnvjfqwrcgsmlb';
      expect(7).to.equal(findStartOfPacket(buffer));
    });
  });
});
