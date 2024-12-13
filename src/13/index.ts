import { cloneDeep } from 'lodash';
import { sum } from '../utils/math';
import { readFileFromInput, getInputFileName } from '../utils/readFile';

export async function main() {
  const input = (await readFileFromInput(getInputFileName(__dirname)))
    .split('\r\n\r\n')
    .map((block) => block.split('\r\n'));

  const regex = /.+X.(\d+), Y.(\d+)/;
  const config = input.map(([a, b, p]) => {
    const [ax, ay] = a.match(regex).slice(1).map(Number);
    const [bx, by] = b.match(regex).slice(1).map(Number);
    const [px, py] = p.match(regex).slice(1).map(Number);

    return {
      a: { x: ax, y: ay },
      b: { x: bx, y: by },
      p: { x: px, y: py },
    };
  });

  console.log('Part 1:', config.map((c) => getTokens(c)).reduce(sum));
  console.log('Part 2:', config.map((c) => getTokens(c, true)).reduce(sum));
}

function getTokens(
  config: {
    a: { x: number; y: number };
    b: { x: number; y: number };
    p: { x: number; y: number };
  },
  partTwo = false
): number {
  const { a, b, p } = cloneDeep(config);
  if (partTwo) {
    p.x += 10000000000000;
    p.y += 10000000000000;
  }

  const y = (p.y * a.x - p.x * a.y) / (-b.x * a.y + b.y * a.x);
  const x = (p.x - y * b.x) / a.x;
  if (y !== Math.round(y) || x !== Math.round(x)) {
    return 0;
  }

  return x * 3 + y;
}
