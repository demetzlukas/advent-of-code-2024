import { readLinesFromInput, getInputFileName } from '../utils/readFile';

let a = 0;
let b = 0;
let c = 0;

function getOperand(operand: number): number {
  if (operand < 4) {
    return operand;
  }
  if (operand === 4) {
    return a;
  }
  if (operand === 5) {
    return b;
  }
  if (operand === 6) {
    return c;
  }

  throw new Error('Not possible');
}
export async function main() {
  const input = await readLinesFromInput(getInputFileName(__dirname));
  const ops = input.pop().split(' ').pop().split(',').map(Number);

  a = Number(input[0].split(' ').pop());
  b = Number(input[1].split(' ').pop());
  c = Number(input[2].split(' ').pop());

  console.log('Part 1:', run(ops).join(','));
}

function run(ops: number[]) {
  let pointer = 0;
  const out = [];

  while (true) {
    if (pointer === ops.length) {
      return out;
    }
    let operation = ops[pointer];
    let operand = ops[pointer + 1];
    let combo = getOperand(operand);

    if (operation === 0) {
      a = Math.floor(a / Math.pow(2, combo));
    } else if (operation === 1) {
      b = b ^ operand;
    } else if (operation === 2) {
      b = combo % 8;
    } else if (operation === 3) {
      if (a !== 0) {
        pointer = combo;
        continue;
      }
    } else if (operation === 4) {
      b = b ^ c;
    } else if (operation === 5) {
      out.push(combo % 8);
    } else if (operation === 6) {
      b = Math.floor(a / Math.pow(2, combo));
    } else if (operation === 7) {
      c = Math.floor(a / Math.pow(2, combo));
    }
    pointer += 2;
  }
}
