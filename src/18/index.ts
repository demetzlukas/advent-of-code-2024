import { isInBounds } from '../utils/arrays';
import { readLinesFromInput, getInputFileName } from '../utils/readFile';

export async function main() {
  const input = (await readLinesFromInput(getInputFileName(__dirname))).map(
    (line) => line.split(',').map(Number)
  );

  const width = 71;
  const height = 71;
  const [sx, sy] = [0, 0];
  const [ex, ey] = [70, 70];

  const map = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => '.')
  );
  let i = 0;
  for (const [y, x] of input) {
    map[x][y] = '#';
    if (i === 1023) {
      break;
    }
    i++;
  }

  console.log('Part 1:', findPath(map, [sx, sy], [ex, ey]));

  while (true) {
    const [y, x] = input[i++];
    map[x][y] = '#';
    const pathLength = findPath(map, [sx, sy], [ex, ey]);
    if (pathLength === -1) {
      console.log('Part 2:', `${y},${x}`);
      break;
    }
  }
}

function findPath(
  map: string[][],
  [sx, sy]: [number, number],
  [ex, ey]: [number, number]
) {
  const distances = new Map<string, number>();
  const states = [];
  states.push([0, sx, sy]);

  while (states.length > 0) {
    const [d, x, y] = states.shift();
    if (x === ex && y === ey) {
      distances.set(`${ex}x${ey}`, d);
      return d;
    }
    if (map[x][y] === '#') {
      continue;
    }
    const storedDistance =
      distances.get(`${x}x${y}`) ?? Number.MAX_SAFE_INTEGER;
    if (d >= storedDistance) {
      continue;
    }
    distances.set(`${x}x${y}`, d);
    for (const [dx, dy] of [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ]) {
      const [nx, ny] = [x + dx, y + dy];
      if (!isInBounds(map, nx, ny)) {
        continue;
      }
      states.push([d + 1, nx, ny]);
    }

    states.sort(([da], [db]) => da - db);
  }

  return -1;
}
