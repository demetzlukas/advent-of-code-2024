import { sum } from '../utils/math';
import {
  readLinesFromInput,
  getInputFileName,
  readFileFromInput,
} from '../utils/readFile';

export async function main() {
  const input = (await readFileFromInput(getInputFileName(__dirname))).split(
    '\r\n\r\n'
  );

  const rules = input[0]
    .split('\r\n')
    .map((line) => line.split('|').map(Number));

  const orderings = input[1].split('\r\n').map((line) => {
    const values = line.split(',').map(Number);
    const map = new Map<string | number, number>(
      Array.from(values, (value, index) => [value, index])
    );
    map.set('middle', values[(values.length - 1) / 2]);
    return map;
  });

  console.log(
    'Part 1:',
    orderings
      .filter((map) => rules.every(([a, b]) => isInCorrectOrder(map, a, b)))
      .map((map) => map.get('middle'))
      .reduce(sum)
  );

  const notOrdered = orderings.filter((map) =>
    rules.some(([a, b]) => !isInCorrectOrder(map, a, b))
  );

  let answer = 0;
  notOrdered.forEach((entry) => {
    entry.delete('middle');
    while (true) {
      let index = 0;
      while (index < rules.length) {
        const [a, b] = rules[index];
        if (
          (entry.has(a) && entry.has(b) && entry.get(a) < entry.get(b)) ||
          !entry.has(a) ||
          !entry.has(b)
        ) {
          index++;
        } else {
          const temp = entry.get(a);
          entry.set(a, entry.get(b));
          entry.set(b, temp);
          index = 0;
        }
      }
      break;
    }
    const values = [];
    for (const [value, index] of entry.entries()) {
      values[index] = value;
    }
    answer += values[(values.length - 1) / 2];
  });
  console.log('Part 2:', answer);
}

function isInCorrectOrder(
  map: Map<string | number, number>,
  a: number,
  b: number
) {
  if (map.has(a) && map.has(b)) {
    return map.get(a) < map.get(b);
  }
  return true;
}
