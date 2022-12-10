import { expect } from 'chai';
import { findStartOfPacket, main, partTwo } from '../index';

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
  describe(`partTwo`, () => {
    it(`should find the first time a marker appears pt 2`, () => {
      const buffers = new Map<string, number>([
        ['mjqjpqmgbljsphdztnvjfqwrcgsmlb', 19],
        ['bvwbjplbgvbhsrlpgdmjqwftvncz', 23],
        ['nppdvjthqldpwncqszvftbrmjlhg', 23],
        ['nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', 29],
        ['zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', 26],
      ]);
      buffers.forEach((expected, testData) => {
        expect(expected).to.equal(partTwo(testData));
      });
    });
  });
});
