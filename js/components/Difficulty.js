import enumeration from '../util/enum';

const Difficulty = enumeration(
  'EASY',
  'MEDIUM',
  'HARD'
);

const ORDERED_DIFFICULTIES = [ Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD ];

export const DIFFICULTY_COLOR = {
  [Difficulty.EASY]: 'green',
  [Difficulty.MEDIUM]: 'orange',
  [Difficulty.HARD]: 'red'
};

export const DIFFICULTY_TEXT = {
  [Difficulty.EASY]: 'easy',
  [Difficulty.MEDIUM]: 'moderate',
  [Difficulty.HARD]: 'difficult'
};

export function getHardest(difficulties) {
  if (!difficulties || difficulties.length === 0) {
    return Difficulty.EASY;
  } else {
    return _.maxBy(difficulties, d => ORDERED_DIFFICULTIES.indexOf(d));
  }
}

export function getEasiest(difficulties) {
  if (!difficulties || difficulties.length === 0) {
    return Difficulty.EASY;
  } else {
    return _.minBy(difficulties, d => ORDERED_DIFFICULTIES.indexOf(d));
  }
}

export default Difficulty;
