import { cloneDeep, LoDashImplicitNumberArrayWrapper } from 'lodash';
import { isInBounds } from '../utils/arrays';
import { readLinesFromInput, getInputFileName } from '../utils/readFile';

export async function main() {
  const input = (await readLinesFromInput(getInputFileName(__dirname))).map(
    (line) => line.split('')
  );

  const startPosition = findStartPosition(input);
  const visited = getPath(input, startPosition);
  console.log('Part 1:', visited.size);

  console.log(
    'Part 2:',
    [...visited.values()]
      .map((values) => values.split('x').map(Number))
      .filter(([x, y]) => hasLoop(input, x, y, startPosition)).length
  );
}

function findStartPosition(input: string[][]): [number, number] {
  for (const [index, line] of input.entries()) {
    const startIndex = line.indexOf('^');
    if (startIndex !== -1) {
      return [index, startIndex];
    }
  }
  throw new Error('No start position found!');
}

function hasLoop(
  input: string[][],
  x: number,
  y: number,
  startPosition: [number, number]
): boolean {
  input = cloneDeep(input);
  input[x][y] = '#';

  return getPath(input, startPosition, true) === null;
}

function getPath(
  input: string[][],
  startPosition: [number, number],
  partTwo = false
) {
  const directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];
  let direction = 0;
  let [x, y] = startPosition;
  const visited = new Set<string>();

  while (true) {
    if (partTwo && visited.has(`${direction}x${x}x${y}`)) {
      return null;
    }
    visited.add(`${partTwo ? `${direction}x` : ''}${x}x${y}`);
    const [dx, dy] = directions[direction];
    let nextX = x + dx;
    let nextY = y + dy;
    if (!isInBounds(input, nextX, nextY)) {
      break;
    }
    if (input[nextX][nextY] === '#') {
      direction = ++direction % 4;
    } else {
      x = nextX;
      y = nextY;
    }
  }

  return visited;
}
