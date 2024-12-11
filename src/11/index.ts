import { sum } from '../utils/math';
import { getInputFileName, readFileFromInput } from '../utils/readFile';

export async function main() {
  const input = (await readFileFromInput(getInputFileName(__dirname)))
    .split(' ')
    .map(Number);

  let stones = getStones(input);
  const part1 = 25;
  const rounds = 75;

  for (let index = 0; index < rounds; index++) {
    if (index === part1) {
      console.log('Part 1:', stones.values().reduce(sum));
    }
    stones = evolve(stones);
  }

  console.log('Part 2:', stones.values().reduce(sum));
}

function evolve(stones: Map<number, number>): Map<number, number> {
  const nextStones = new Map<number, number>();

  for (const [stone, frequency] of stones.entries()) {
    if (stone === 0) {
      nextStones.set(1, frequency + (nextStones.get(1) ?? 0));
    } else if (stone.toString().length % 2 === 0) {
      let numberAsString = stone.toString();
      const first = numberAsString.slice(0, numberAsString.length / 2);
      const second = numberAsString.slice(numberAsString.length / 2);
      nextStones.set(
        Number(first),
        frequency + (nextStones.get(Number(first)) ?? 0)
      );
      nextStones.set(
        Number(second),
        frequency + (nextStones.get(Number(second)) ?? 0)
      );
    } else {
      nextStones.set(
        stone * 2024,
        frequency + (nextStones.get(stone * 2024) ?? 0)
      );
    }
  }

  return nextStones;
}

function getStones(input: number[]) {
  let stones = new Map<number, number>();

  for (const stone of input) {
    let number = stones.get(stone) ?? 0;
    stones.set(stone, number + 1);
  }
  return stones;
}
