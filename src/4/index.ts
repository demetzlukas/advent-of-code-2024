import { isInBounds } from '../utils/arrays';
import { readLinesFromInput, getInputFileName } from '../utils/readFile';

export async function main() {
  const input = (await readLinesFromInput(getInputFileName(__dirname))).map(
    (line) => line.split('')
  );

  let answer = 0;

  for (let row = 0; row < input.length; row++) {
    for (let column = 0; column < input[row].length; column++) {
      const letter = input[row][column];
      if (letter !== 'X') continue;
      answer += findXMAS(input, row, column);
    }
  }
  console.log('Part 1:', answer);

  answer = 0;

  for (let row = 0; row < input.length; row++) {
    for (let column = 0; column < input[row].length; column++) {
      const letter = input[row][column];
      if (letter !== 'A') continue;
      answer += findXMASCross(input, row, column);
    }
  }
  console.log('Part 2:', answer);
}

function findXMAS(input: string[][], row: number, column: number) {
  const toFind = ['X', 'M', 'A', 'S'];
  const diffs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
  ];

  return diffs.filter(([dx, dy]) =>
    includesXMAS(input, row, column, dx, dy, toFind)
  ).length;
}

function includesXMAS(
  input: string[][],
  row: number,
  column: number,
  dx: number,
  dy: number,
  toFind: string[]
) {
  for (let i = 0; i < toFind.length; i++) {
    if (!isInBounds(input, row, column) || input[row][column] !== toFind[i]) {
      return false;
    }
    row = row + dx;
    column = column + dy;
  }

  return true;
}

function checkDiagonal(
  input: string[][],
  row: number,
  column: number,
  diffs: number[][]
) {
  const set = new Set(['M', 'S']);
  for (const [dx, dy] of diffs) {
    const x = row + dx;
    const y = column + dy;

    if (!isInBounds(input, x, y)) {
      return false;
    }
    if (set.has(input[x][y])) {
      set.delete(input[x][y]);
    } else {
      return false;
    }
  }

  return true;
}

function findXMASCross(input: string[][], row: number, column: number) {
  const diffs = [
    [
      [1, 1],
      [-1, -1],
    ],
    [
      [-1, 1],
      [1, -1],
    ],
  ];

  return diffs.every((d) => checkDiagonal(input, row, column, d)) ? 1 : 0;
}
