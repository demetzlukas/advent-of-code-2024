import { isInBounds } from '../utils/arrays';
import { sum } from '../utils/math';
import { readLinesFromInput, getInputFileName } from '../utils/readFile';

export async function main() {
  const input = (await readLinesFromInput(getInputFileName(__dirname))).map(
    (line) => line.split('').map(Number)
  );

  const trails = [];
  for (const [r, row] of input.entries()) {
    for (const [c, cell] of row.entries()) {
      if (cell === 0) {
        trails.push(getTrails(input, r, c));
      }
    }
  }

  console.log('Part 1:', trails.map((t) => new Set(t).size).reduce(sum));
  console.log('Part 2:', trails.map((t) => t.length).reduce(sum));
}

function getTrails(input: number[][], r: number, c: number): string[] {
  const queue = [[r, c]];
  const trailEnds = [];

  while (queue.length > 0) {
    const [x, y] = queue.shift();

    if (input[x][y] === 9) {
      trailEnds.push(`${x}x${y}`);
      continue;
    }
    for (const [dx, dy] of [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ]) {
      const [nextX, nextY] = [x + dx, y + dy];
      if (
        isInBounds(input, nextX, nextY) &&
        input[x][y] + 1 === input[nextX][nextY]
      ) {
        queue.push([nextX, nextY]);
      }
    }
  }

  return trailEnds;
}
