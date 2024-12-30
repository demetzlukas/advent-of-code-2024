import { readLinesFromInput, getInputFileName } from '../utils/readFile';

export async function main() {
  const input = (await readLinesFromInput(getInputFileName(__dirname))).map(
    (line) => line.split('')
  );

  const [startX, startY] = find(input, 'S');

  const scores: number[] = [];
  const visited = new Set<string>();
  const states = [];
  states.push(['>', startX, startY, 0]);
  let minScore = Number.MAX_SAFE_INTEGER;

  while (states.length > 0) {
    let [direction, x, y, score] = states.shift();

    const [dx, dy] = getDirection(direction);
    const [left, right] = getTurningDirections(direction);
    const [lx, ly] = getDirection(left);
    const [rx, ry] = getDirection(right);

    while (input[x][y] !== '#') {
      if (visited.has(`${x}x${y}x${direction}`)) {
        break;
      }
      visited.add(`${x}x${y}x${direction}`);

      if (input[x][y] === 'E') {
        scores.push(score);
        minScore = Math.min(minScore, score);
      }
      if (input[x + lx][y + ly] !== '#') {
        states.unshift([left, x, y, score + 1000]);
      }
      if (input[x + rx][y + ry] !== '#') {
        states.unshift([right, x, y, score + 1000]);
      }
      x += dx;
      y += dy;
      score++;
    }
    states.sort((a, b) => a[a.length - 1] - b[b.length - 1]);
  }

  console.log('Part 1:', minScore);
}

function getDirection(direction: string): [number, number] {
  const directions = {
    '>': [0, 1],
    v: [1, 0],
    '<': [0, -1],
    '^': [-1, 0],
  };

  return directions[direction];
}

function getTurningDirections(direction: string): [string, string] {
  const directions = {
    '>': ['^', 'v'],
    v: ['<', '>'],
    '<': ['^', 'v'],
    '^': ['>', '<'],
  };

  return directions[direction];
}

function find(input: string[][], toFind: string): [number, number] {
  for (const [i, row] of input.entries()) {
    for (const [c, cell] of row.entries()) {
      if (cell === toFind) {
        return [i, c];
      }
    }
  }

  throw new Error('Not Found');
}
