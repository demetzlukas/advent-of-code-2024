import { isInBounds } from '../utils/arrays';
import { sum } from '../utils/math';
import { readLinesFromInput, getInputFileName } from '../utils/readFile';

export async function main() {
  const input = (await readLinesFromInput(getInputFileName(__dirname))).map(
    (line) => line.split('')
  );

  const areas = [];
  let plant = '';
  const seen = new Set<string>();

  for (const [r, row] of input.entries()) {
    for (const [c, cell] of row.entries()) {
      if (seen.has(`${r}x${c}`)) {
        continue;
      }
      if (cell !== plant) {
        plant = cell;
        areas.push(getPlantArea(input, r, c, plant, seen));
        plant = '';
      }
    }
  }

  console.log(
    'Part 1:',
    areas
      .map((area) => area.length * getNeighbors(input, area).length)
      .reduce(sum)
  );

  console.log(
    'Part 2:',
    areas.map((area) => area.length * getNumberOfSides(input, area)).reduce(sum)
  );
}

function getPlantArea(
  input: string[][],
  r: number,
  c: number,
  plant: string,
  seen: Set<string>
): any {
  const direction = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  const next = [[r, c]];
  const area = new Set<string>();

  while (next.length > 0) {
    const [x, y] = next.shift();
    area.add(`${x}x${y}`);
    if (seen.has(`${x}x${y}`)) {
      continue;
    }
    seen.add(`${x}x${y}`);

    for (const [dx, dy] of direction) {
      const [nx, ny] = [x + dx, y + dy];
      if (
        !isInBounds(input, nx, ny) ||
        input[nx][ny] !== plant ||
        seen.has(`${nx}x${ny}`)
      ) {
        continue;
      }
      next.push([nx, ny]);
    }
  }

  return [...area.values()].map((key) => key.split('x').map(Number));
}

function getNeighbors(
  input: any[][],
  area: [number, number][]
): [number, number][] {
  const neighbors = [];
  const direction = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  for (const [x, y] of area) {
    for (const [dx, dy] of direction) {
      const [nx, ny] = [x + dx, y + dy];
      if (!isInBounds(input, nx, ny) || input[x][y] !== input[nx][ny]) {
        neighbors.push([nx, ny]);
      }
    }
  }

  return neighbors;
}

function getNumberOfSides(input: any[][], area: [number, number][]): number {
  let sides = 0;
  const horizontal = new Set(area.map(([x]) => x));
  const vertical = new Set(area.map(([_, y]) => y));

  for (const d of [-1, 1]) {
    for (const h of horizontal) {
      let isEdge = false;
      const indices = area.filter(([x]) => x === h).map(([_, y]) => y);

      const min = Math.min(...indices);
      const max = Math.max(...indices) + 1;

      for (let i = min; i < max; i++) {
        if (!indices.includes(i)) {
          isEdge = false;
          continue;
        }
        if (!isInBounds(input, h + d, i) || input[h + d][i] !== input[h][i]) {
          if (!isEdge) {
            sides++;
            isEdge = true;
          }
        } else {
          isEdge = false;
        }
      }
    }
  }
  for (const d of [-1, 1]) {
    for (const v of vertical) {
      let isEdge = false;
      const indices = area.filter(([_, y]) => y === v).map(([x]) => x);

      const min = Math.min(...indices);
      const max = Math.max(...indices) + 1;

      for (let i = min; i < max; i++) {
        if (!indices.includes(i)) {
          isEdge = false;
          continue;
        }
        if (!isInBounds(input, i, v + d) || input[i][v + d] !== input[i][v]) {
          if (!isEdge) {
            sides++;
            isEdge = true;
          }
        } else {
          isEdge = false;
        }
      }
    }
  }

  return sides;
}
