import * as fs from 'fs';
import * as path from 'path';

interface PlayerRoundState {
  roundScore: RoundScore;
  roundOutcome: RoundOutcomeScore;
}
interface RoundScore {
  'rock': 1;
  'paper': 2;
  'scissors': 3;
};
interface RoundOutcomeScore {
  'win': 6;
  'lose': 0;
  'draw': 3;
}
type RoundOutcome = keyof RoundOutcomeScore;
type PlayType = keyof RoundScore;
type OpponentKey = 'A' | 'B' | 'C';
type PlayerKey = 'X' | 'Y' | 'Z';

const opponentGuide = new Map<OpponentKey, PlayType>([
  ['A', 'rock'],
  ['B', 'paper'],
  ['C', 'scissors'],
]);
const playerGuide = new Map<PlayerKey, RoundOutcome>([
  ['X', 'lose'],
  ['Y', 'draw'],
  ['Z', 'win'],
]);
const roundScoreMap = new Map<PlayType, RoundScore[PlayType]>([
  ['rock', 1],
  ['paper', 2],
  ['scissors', 3],
]);
const roundOutcomeScoreMap = new Map<RoundOutcome, RoundOutcomeScore[RoundOutcome]>([
  ['win', 6],
  ['lose', 0],
  ['draw', 3],
]);

const determineOutcome = (opponentPlay: PlayType, playerPlay: PlayType): RoundOutcome => {
  switch(playerPlay) {
    case 'rock':
      if (opponentPlay === 'scissors') return 'win';
      if (opponentPlay === 'rock') return 'draw';
      if (opponentPlay === 'paper') return 'lose';
    case 'paper':
      if (opponentPlay === 'scissors') return 'lose';
      if (opponentPlay === 'rock') return 'win';
      if (opponentPlay === 'paper') return 'draw';
    case 'scissors':
      if (opponentPlay === 'scissors') return 'draw';
      if (opponentPlay === 'rock') return 'lose';
      if (opponentPlay === 'paper') return 'win';
  }
};

const determinePlay = (opponentPlay: PlayType, outcome: RoundOutcome): PlayType => {
  switch(outcome) {
    case 'draw':
      return opponentPlay;
    case 'lose':
      if (opponentPlay === 'scissors') return 'paper';
      if (opponentPlay === 'rock') return 'scissors';
      if (opponentPlay === 'paper') return 'rock';
    case 'win':
      if (opponentPlay === 'scissors') return 'rock';
      if (opponentPlay === 'rock') return 'paper';
      if (opponentPlay === 'paper') return 'scissors';
  }
}

export const aoc02 = (): number => {
  try {
    let totalScore = 0;
    let outcomes = [];
    const data = fs.readFileSync(path.resolve(__dirname, './data/strategy-guide.txt'));
    const strategyGuideRounds: string[] = data.toString().split('\n').filter(x => !!x);
    strategyGuideRounds.forEach((guideKeys) => {
      const guideParts = guideKeys.split(' ');
      const opponentKey = guideParts[0] as OpponentKey;
      const playerKey = guideParts[1] as PlayerKey;
      const opponentPlay = opponentGuide.get(opponentKey);
      const roundOutcome = playerGuide.get(playerKey);
      const roundOutcomeScore = roundOutcomeScoreMap.get(roundOutcome);
      const outcome = playerGuide.get(playerKey);
      const playerPlay = determinePlay(opponentPlay, outcome);
      const basePlayerScore = roundScoreMap.get(playerPlay);
      const totalRoundScore = basePlayerScore + roundOutcomeScore;
      totalScore += totalRoundScore;
    });
    console.log(totalScore);
    return totalScore;
  }
  catch(err) {
    console.error(err);
  }
};

// for node runs
aoc02();
