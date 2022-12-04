import { readFileSync } from 'fs';
import { resolve } from 'path';

interface PartnerAssignmentInclusivityModel {
  readonly rangeOne: string;
  readonly rangeTwo: string;
  readonly rangeOneInsideRangeTwo: boolean;
  readonly rangeTwoInsideRangeOne: boolean;
  readonly assignmentsFullyContained: boolean;
}

interface PartnerAssignmentOverlapModel {
  readonly rangeOne: string;
  readonly rangeTwo: string;
  readonly assignmentsOverlap: boolean;
}

export const determineIfAssignmentsAreInclusive = (partnerAssignments: string): PartnerAssignmentInclusivityModel => {
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

export const determineIfAssignmentsOverlap = (partnerAssignments: string): PartnerAssignmentOverlapModel => {
  const [rangeOne, rangeTwo ] = partnerAssignments.split(',');
  const [lowNumberOne, highNumberOne] = rangeOne.split('-').map(Number);
  const [lowNumberTwo, highNumberTwo] = rangeTwo.split('-').map(Number);
  const lowestNumber = Math.min(lowNumberOne, lowNumberTwo);
  const highestNumber = Math.max(highNumberOne, highNumberTwo);
  let assignmentsOverlap = false;
  for (let i = lowestNumber; i <= highestNumber; i++) {
    const indexInOne = i >= lowNumberOne && i <= highNumberOne;
    const indexInTwo = i >= lowNumberTwo && i <= highNumberTwo;
    if (indexInOne && indexInTwo) {
      assignmentsOverlap = true;
      break;
    }
  }
  return {
    rangeOne,
    rangeTwo,
    assignmentsOverlap
  }
}

export const main = (): number => {
  // read in the file
  const rawFileData = readFileSync(resolve(__dirname, 'section-assignments.txt'));
  // parse it
  const sectionAssignmentsData = rawFileData.toString().split('\n').filter(x => !!x);
  // get data about each row
  const partnerAssigments = sectionAssignmentsData.map(determineIfAssignmentsOverlap);
  // how many assignment pairs does one range fully contain the other
  const overlappingAssigmentsCount = partnerAssigments.filter(({assignmentsOverlap}) => assignmentsOverlap).length;
  console.log({containedAssignmentsCount: overlappingAssigmentsCount});
  return overlappingAssigmentsCount;
}

// for node runs
main();
