import { isInBounds } from '../utils/arrays';
import { readLinesFromInput, getInputFileName } from '../utils/readFile';

export async function main() {
  const input = (await readLinesFromInput(getInputFileName(__dirname))).map(
    (line) => line.split('')
  );

  const antennas = getAntennas(input);

  console.log('Part 1:', getAntinodes(antennas, input).size);
  console.log('Part 2:', getAntinodes(antennas, input, true).size);
}

function getAntinodes(
  antennas: Map<string, Set<[number, number]>>,
  input: string[][],
  partTwo = false
): Set<string> {
  const antinodes = new Set<string>();
  for (const frequency of antennas.values()) {
    for (const [aX, aY] of frequency) {
      for (const [oX, oY] of frequency) {
        if (aX === oX && aY === oY) {
          continue;
        }
        const [dX, dY] = [aX - oX, aY - oY];
        let [fX, fY] = [oX, oY];
        let [gX, gY] = [aX, aY];

        if (!partTwo) {
          fX -= dX;
          fY -= dY;
          gX += dX;
          gY += dY;
        }

        while (isInBounds(input, fX, fY)) {
          const cell = input[fX][fY];

          if (!antennas.has(cell) || antennas.get(cell).size > 1) {
            antinodes.add(`${fX}x${fY}`);
          }
          fX -= dX;
          fY -= dY;
          if (!partTwo) {
            break;
          }
        }
        while (isInBounds(input, gX, gY)) {
          const cell = input[gX][gY];

          if (!antennas.has(cell) || antennas.get(cell)?.size > 1) {
            antinodes.add(`${gX}x${gY}`);
          }
          gX += dX;
          gY += dY;
          if (!partTwo) {
            break;
          }
        }
      }
    }
  }
  return antinodes;
}

function getAntennas(input: string[][]) {
  const antennas = new Map<string, Set<[number, number]>>();
  for (const [rowIndex, row] of input.entries()) {
    for (const [columnIndex, symbol] of row.entries()) {
      if (symbol === '.') {
        continue;
      }
      let frequency = antennas.get(symbol);
      if (!frequency) {
        frequency = new Set<[number, number]>();
        antennas.set(symbol, frequency);
      }
      frequency.add([rowIndex, columnIndex]);
    }
  }
  return antennas;
}
