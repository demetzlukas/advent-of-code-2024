import { readLinesFromInput, getInputFileName } from '../utils/readFile';

export async function main() {
  const input = (await readLinesFromInput(getInputFileName(__dirname))).map(
    (line) => line.split(' ').map((v) => Number(v))
  );

  console.log('Part 1:', checkForValid(input));
  console.log('Part 2:', checkForValid(input, true));
}

function checkForValid(input: number[][], remove = false) {
  let counter = 0;
  for (const line of input) {
    if (isValid(line)) {
      counter++;
    } else if (remove) {
      for (let i = 0; i < line.length; i++) {
        const newLine = line.toSpliced(i, 1);
        if (isValid(newLine)) {
          counter++;
          break;
        }
      }
    }
  }

  return counter;
}

function isValid(line: number[]) {
  const descending = line[0] > line[1];
  for (let i = 0; i < line.length - 1; i++) {
    if (line[i] > line[i + 1] !== descending) {
      return false;
    }
    const diff = Math.abs(line[i] - line[i + 1]);
    if (diff < 1 || diff > 3) {
      return false;
    }
  }
  return true;
}
