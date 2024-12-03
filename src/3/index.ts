import { readLinesFromInput, getInputFileName } from '../utils/readFile';

export async function main() {
  const input = (await readLinesFromInput(getInputFileName(__dirname))).join();

  console.log('Part 1:', doMultiplication(input));
  console.log('Part 2:', doMultiplication(input, true));
}

function doMultiplication(input: string, partTwo = false) {
  const regex = /do\(\)|don't\(\)|mul\((\d+),(\d+)\)/;
  let doCalc = true;
  let answer = 0;
  let copy = '' + input;
  while (copy.length > 0) {
    const match = regex.exec(copy);
    if (!match) {
      return answer;
    }

    if (match[0] === 'do()') {
      doCalc = true;
    } else if (match[0] === "don't()") {
      doCalc = false;
    } else if (doCalc || !partTwo) {
      answer += Number(match[1]) * Number(match[2]);
    }
    copy = copy.slice(match.index + match[0].length);
  }
  return answer;
}
