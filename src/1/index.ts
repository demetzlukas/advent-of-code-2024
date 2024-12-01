import { sum } from '../utils/math';
import { readLinesFromInput, getInputFileName } from '../utils/readFile';
import { zip } from 'lodash';

export async function main() {
  const input = (await readLinesFromInput(getInputFileName(__dirname))).map(
    (line) => line.split(/ +/)
  );

  const left = input.flatMap(([a]) => Number(a));
  const right = input.flatMap(([_, b]) => Number(b));

  left.sort();
  right.sort();

  console.log(
    'Part 1:',
    zip(left, right)
      .map(([a, b]) => Math.abs(a - b))
      .reduce(sum)
  );

  console.log(
    'Part 2:',
    left
      .map((value) => right.filter((other) => other === value).length * value)
      .reduce(sum)
  );
}
