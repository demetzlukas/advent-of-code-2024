import { cloneDeep } from 'lodash';
import { readLinesFromInput, getInputFileName } from '../utils/readFile';

export async function main() {
  const regex = /p=(\d+),(\d+) v=(-?\d+),(-?\d+)/;
  const input = (await readLinesFromInput(getInputFileName(__dirname))).map(
    (line) => {
      const [y, x, dy, dx] = line.match(regex).slice(1, 5).map(Number);
      return { x, y, dx, dy };
    }
  );
  const maxX = 103;
  const maxY = 101;
  const middleX = Math.floor(maxX / 2);
  const middleY = Math.floor(maxY / 2);

  let robots = cloneDeep(input);
  const seconds = 100;
  let minSize = Number.MAX_SAFE_INTEGER;
  let minSeconds = 0;

  for (let i = 0; i < 10000; i++) {
    if (i === seconds) {
      console.log('Part 1:', getNumberOrRobots(robots, middleX, middleY));
    }
    robots = nextStep(robots, maxX, maxY);

    // idea from reddit
    // before checked whether image contains multiple #
    const imageSize = compressString(display(robots, maxX, maxY)).length;
    if (imageSize < minSize) {
      minSize = imageSize;
      minSeconds = i;
    }
  }

  console.log('Part 2:', minSeconds + 1);
}
function getNumberOrRobots(
  robots: { x: number; y: number; dx: number; dy: number }[],
  middleX: number,
  middleY: number
) {
  let number = 1;

  number *= robots.filter(({ x, y }) => x < middleX && y < middleY).length;
  number *= robots.filter(({ x, y }) => x > middleX && y < middleY).length;
  number *= robots.filter(({ x, y }) => x < middleX && y > middleY).length;
  number *= robots.filter(({ x, y }) => x > middleX && y > middleY).length;

  return number;
}

function nextStep(
  robots: { x: number; y: number; dx: number; dy: number }[],
  maxX: number,
  maxY: number
) {
  const next = [];
  for (const { x, y, dx, dy } of robots) {
    let nextX = x + dx;
    let nextY = y + dy;

    if (nextX < 0) {
      nextX += maxX;
    } else if (nextX >= maxX) {
      nextX -= maxX;
    }
    if (nextY < 0) {
      nextY += maxY;
    } else if (nextY >= maxY) {
      nextY -= maxY;
    }
    next.push({ x: nextX, y: nextY, dx, dy });
  }
  return next;
}

function display(
  robots: { x: number; y: number; dx: number; dy: number }[],
  maxX: number,
  maxY: number
) {
  const display = Array.from({ length: maxX }, () =>
    Array.from({ length: maxY }, () => '.')
  );

  robots.forEach(({ x, y }) => {
    // console.log(x, y);
    display[x][y] = '#';
  });

  return display.map((row) => row.join('')).join('\n');
}

function compressString(string: string): string {
  string += '-';
  let char = '';
  let counter = 0;
  let out = '';

  for (const c of string.split('')) {
    if (c !== char) {
      out += char + counter;
      char = c;
      counter = 0;
    }
    if (c === char) {
      counter++;
    }
  }

  return out;
}
