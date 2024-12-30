import { isInBounds } from '../utils/arrays';
import { getInputFileName, readFileFromInput } from '../utils/readFile';

export async function main() {
  const [a, b] = (await readFileFromInput(getInputFileName(__dirname))).split(
    '\r\n\r\n'
  );

  const map = a.split('\r\n').map((line) => line.split(''));
  const moves = b.split('\r\n').join('').split('');
  let [x, y] = getStartPosition(map);

  for (const m of moves) {
    [x, y] = move(map, x, y, m);
  }

  console.log('Part 1:', getGPSCoordinates(map, 'O'));

  const newMap = getNewMap(a.split('\r\n').map((line) => line.split('')));

  [x, y] = getStartPosition(newMap);
  for (const m of moves) {
    [x, y] = move(newMap, x, y, m);
  }

  console.log('Part 2:', getGPSCoordinates(newMap, '['));
}

function getGPSCoordinates(map: string[][], char: string): number {
  let sum = 0;
  for (const [r, row] of map.entries()) {
    for (const [c, cell] of row.entries()) {
      if (cell === char) {
        sum += r * 100 + c;
      }
    }
  }

  return sum;
}

function getBoxesToMoveHorizontally(
  map: string[][],
  x: number,
  y: number,
  dy: number
) {
  let nextY = y + dy;
  const final = [];

  while ('[]'.includes(map[x][nextY])) {
    if (map[x][nextY + dy] === '#') {
      return [];
    }
    final.push([map[x][nextY], x, nextY]);
    nextY += dy;
  }

  return final;
}

function getBoxesToMoveVertically(
  map: string[][],
  x: number,
  y: number,
  dx: number,
  dy: number
) {
  let [nextX, nextY] = [x + dx, y + dy];
  const final = [];
  const toVisit = [];

  if (map[nextX][nextY] === '[') {
    toVisit.push([nextX, nextY, nextX, nextY + 1]);
  } else {
    toVisit.push([nextX, nextY - 1, nextX, nextY]);
  }

  while (toVisit.length > 0) {
    const [lx, ly, rx, ry] = toVisit.shift();
    final.push(['[', lx, ly]);
    final.push([']', rx, ry]);

    if (map[lx + dx][ly + dy] === '#' || map[rx + dx][ry + dy] === '#') {
      return [];
    }
    if (map[lx + dx][ly + dy] === '[') {
      toVisit.push([lx + dx, ly + dy, rx + dx, ry + dy]);
    } else if (map[lx + dx][ly + dy] === ']') {
      toVisit.push([lx + dx, ly + dy - 1, lx + dx, ly + dy]);
    }
    if (map[rx + dx][ry + dy] === '[') {
      toVisit.push([rx + dx, ry + dy, rx + dx, ry + dy + 1]);
    }
  }

  return final;
}

function getBoxesToMovePart1(
  map: string[][],
  x: number,
  y: number,
  dx: number,
  dy: number
) {
  let [nextX, nextY] = [x + dx, y + dy];
  const final = [];
  while (map[nextX][nextY] === 'O') {
    final.push(['O', nextX, nextY]);
    nextX += dx;
    nextY += dy;
  }

  if (map[nextX][nextY] === '#') {
    return [];
  }

  return final;
}

function move(map: string[][], x: number, y: number, move: string) {
  const [dx, dy] = getDirection(move);
  if (map[x + dx][y + dy] === '#') {
    return [x, y];
  }

  let boxes = [];

  if ('[]'.includes(map[x + dx][y + dy])) {
    if (dx === 0) {
      boxes = getBoxesToMoveHorizontally(map, x, y, dy);
    } else {
      boxes = getBoxesToMoveVertically(map, x, y, dx, dy);
    }
  } else {
    boxes = getBoxesToMovePart1(map, x, y, dx, dy);
  }

  for (const [_, a, b] of boxes) {
    map[a][b] = '.';
  }
  for (const [c, a, b] of boxes) {
    map[a + dx][b + dy] = c;
  }

  if (map[x + dx][y + dy] === '.' || boxes.length > 0) {
    map[x][y] = '.';
    x += dx;
    y += dy;
    map[x][y] = '@';
  }

  return [x, y];
}

function getStartPosition(map: string[][]) {
  for (const [r, row] of map.entries()) {
    for (const [c, cell] of row.entries()) {
      if (cell === '@') {
        return [r, c];
      }
    }
  }
  throw new Error('Start not found');
}

function getNewMap(map: string[][]): string[][] {
  const newMap = [];

  for (const row of map) {
    const newRow = [];
    newMap.push(newRow);
    for (const cell of row) {
      if (cell === 'O') {
        newRow.push('[');
        newRow.push(']');
      } else if (cell === '.') {
        newRow.push('.');
        newRow.push('.');
      } else if (cell === '@') {
        newRow.push('@');
        newRow.push('.');
      } else {
        newRow.push('#');
        newRow.push('#');
      }
    }
  }

  return newMap;
}

function getDirection(direction: string): [number, number] {
  const directions = {
    '^': [-1, 0],
    '<': [0, -1],
    v: [1, 0],
    '>': [0, 1],
  };

  return directions[direction];
}
