import { sum } from '../utils/math';
import { readLinesFromInput, getInputFileName } from '../utils/readFile';

export async function main() {
  const input = (await readLinesFromInput(getInputFileName(__dirname)))
    .map((line) => line.split(': '))
    .map(
      ([result, values]) =>
        [Number(result), values.split(' ').map(Number)] as [number, number[]]
    );

  console.log(
    'Part 1:',
    input
      .filter((line) => isValid(line))
      .map(([result]) => result)
      .reduce(sum)
  );

  console.log(
    'Part 2:',
    input
      .filter((line) => isValid(line, true))
      .map(([result]) => result)
      .reduce(sum)
  );
}

function isValid(line: [number, number[]], partTwo = false): boolean {
  const [result, values] = line;
  const combinations = getCombinations(values.length - 1, partTwo);

  return combinations.some((combination) =>
    isValidCombination(result, values, combination)
  );
}

function isValidCombination(
  result: number,
  values: number[],
  combination: string[]
): boolean {
  const copy = [...values];
  while (copy.length > 1) {
    const a = copy.shift();
    const b = copy.shift();
    const operation = combination.shift();

    if (a > result) {
      break;
    }
    if (operation === '+') {
      copy.unshift(a + b);
    } else if (operation === '*') {
      copy.unshift(a * b);
    } else {
      copy.unshift(Number(`${a}${b}`));
    }
  }

  return copy.shift() === result;
}

function getCombinations(length: number, partTwo = false): string[][] {
  let combinations: string[][] = [[]];
  const symbols = ['+', '*'];
  if (partTwo) {
    symbols.push('||');
  }

  for (let i = 0; i < length; i++) {
    const newCombinations: string[][] = [];
    for (const symbol of symbols) {
      for (const combination of combinations) {
        newCombinations.push([...combination, symbol]);
      }
    }
    combinations = newCombinations;
  }

  return combinations;
}
