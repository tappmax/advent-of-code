import { readFileSync } from 'fs';
import { resolve } from 'path';

interface PartnerAssignment {
  readonly rangeOne: string;
  readonly rangeTwo: string;
  readonly rangeOneInsideRangeTwo: boolean;
  readonly rangeTwoInsideRangeOne: boolean;
  readonly assignmentsFullyContained: boolean;
}

export const determineIfAssignmentsAreInclusive = (partnerAssignments: string): PartnerAssignment => {
  const [rangeOne, rangeTwo ] = partnerAssignments.split(',');
  const [lowNumberOne, highNumberOne] = rangeOne.split('-').map(Number);
  const [lowNumberTwo, highNumberTwo] = rangeTwo.split('-').map(Number);
  const rangeOneInsideRangeTwo = lowNumberOne >= lowNumberTwo && highNumberOne <= highNumberTwo;
  const rangeTwoInsideRangeOne = lowNumberTwo >= lowNumberOne && highNumberTwo <= highNumberOne;
  return {
    rangeOne,
    rangeTwo,
    rangeTwoInsideRangeOne,
    rangeOneInsideRangeTwo,
    assignmentsFullyContained: rangeOneInsideRangeTwo || rangeTwoInsideRangeOne
  }
}

export const main = (): number => {
  // read in the file
  const rawFileData = readFileSync(resolve(__dirname, 'section-assignments.txt'));
  // parse it
  const sectionAssignmentsData = rawFileData.toString().split('\n').filter(x => !!x);
  // get data about each row
  const partnerAssigments = sectionAssignmentsData.map(determineIfAssignmentsAreInclusive);
  // how many assignment pairs does one range fully contain the other
  const containedAssignmentsCount = partnerAssigments.filter(({assignmentsFullyContained}) => assignmentsFullyContained).length;
  console.log({containedAssignmentsCount});
  return containedAssignmentsCount;
}

// for node runs
main();
