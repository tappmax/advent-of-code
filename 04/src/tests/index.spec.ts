import { expect } from 'chai';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { determineIfAssignmentsAreInclusive, determineIfAssignmentsOverlap } from '../index';

describe(`Day 4`, () => {
  describe(`data`, () => {
    it(`should provide the data in order, right?`, () => {
      // read in the file
      const rawFileData = readFileSync(resolve(__dirname, 'section-assignments.txt'));
      // parse it
      const sectionAssignmentsData = rawFileData.toString().split('\n').filter(x => !!x);
      sectionAssignmentsData.forEach(dataRow => {
        const [rangeOne, rangeTwo ] = dataRow.split(',');
        const [lowNumberOne, highNumberOne] = rangeOne.split('-').map(Number);
        const [lowNumberTwo, highNumberTwo] = rangeTwo.split('-').map(Number);
        expect(lowNumberOne).to.be.lessThanOrEqual(highNumberOne);
        expect(lowNumberTwo).to.be.lessThanOrEqual(highNumberTwo);
      });
    });
  });

  describe(`determineIfAssignmentsAreInclusive`, () => {
    it(`should correctly calculate inclusive ranges`, () => {
      interface AssignmentTest {
        readonly ranges: string;
        readonly expectedResult: 'inclusive' | 'exclusive-or-overlap'
      }

      const testAssignments: AssignmentTest[] = [
        {ranges: '2-4,1-5', expectedResult: 'inclusive'},
        {ranges: '2-4,3-5', expectedResult: 'exclusive-or-overlap'},
        {ranges: '1-5,2-4', expectedResult: 'inclusive'},
        {ranges: '200-400,1-5', expectedResult: 'exclusive-or-overlap'},
        {ranges: '2-400,80-500', expectedResult: 'exclusive-or-overlap'},
        {ranges: '1-400,100-105', expectedResult: 'inclusive'}
      ];

      testAssignments.forEach(({ranges, expectedResult}) => {
        const {assignmentsFullyContained: actualResult} = determineIfAssignmentsAreInclusive(ranges)
        const compValue = expectedResult === 'inclusive';
        expect(compValue).to.equal(actualResult);
      });
    });
  });

  describe(`determineIfAssignmentsOverlap`, () => {
    it(`should correctly calculate overlapping ranges`, () => {
      interface AssignmentTest {
        readonly ranges: string;
        readonly expectedResult: 'overlap' | 'no-overlappy'
      }

      const testAssignments: AssignmentTest[] = [
        {ranges: '2-4,1-5', expectedResult: 'overlap'},
        {ranges: '2-4,3-5', expectedResult: 'overlap'},
        {ranges: '1-5,2-4', expectedResult: 'overlap'},
        {ranges: '200-400,1-5', expectedResult: 'no-overlappy'},
        {ranges: '2-400,400-500', expectedResult: 'overlap'},
        {ranges: '1-400,100-105', expectedResult: 'overlap'},
        {ranges: '1-400,401-505', expectedResult: 'no-overlappy'},
      ];

      testAssignments.forEach(({ranges, expectedResult}) => {
        const {assignmentsOverlap: actualResult} = determineIfAssignmentsOverlap(ranges)
        const compValue = expectedResult === 'overlap';
        expect(compValue).to.equal(actualResult);
      });
    });
  });
});
