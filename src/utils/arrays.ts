export function getAdjacent(
  row: number,
  column: number,
  field: any[][]
): number[][] {
  const adjacent: number[][] = [];
  for (const x of [-1, 0, 1]) {
    for (const y of [-1, 0, 1]) {
      const dx = row + x;
      const dy = column + y;

      if (!isInBounds(field, dx, dy) || (dx === 0 && dy === 0)) {
        continue;
      }
      adjacent.push([dx, dy]);
    }
  }

  return adjacent;
}

export function rotate(array: any[][]): any[][] {
  return array[0].map((_, c) => array.map((_, r) => array[r][c]).reverse());
}

export function isInBounds(field: any[][], row: number, column: number) {
  return (
    row >= 0 && row < field.length && column >= 0 && column < field[row].length
  );
}
