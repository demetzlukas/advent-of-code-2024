import { sum } from '../utils/math';
import { getInputFileName, readFileFromInput } from '../utils/readFile';

type DiskSpace = {
  id: number;
  start: number;
  length: number;
};

const EMPTY = -1;

export async function main() {
  const input = (await readFileFromInput(getInputFileName(__dirname)))
    .split('')
    .map(Number);

  let free = false;
  let id = 0;
  const layout: number[] = [];

  for (const element of input) {
    for (let index = 0; index < element; index++) {
      layout.push(free ? EMPTY : id);
    }
    if (!free) {
      id++;
    }
    free = !free;
  }

  let start = 0;
  let end = layout.length - 1;

  while (true) {
    while (layout[start] !== EMPTY) {
      start++;
    }
    while (layout[end] === EMPTY) {
      end--;
    }
    if (start >= end) {
      break;
    }
    layout[start] = layout[end];
    layout[end] = EMPTY;
  }

  console.log(
    'Part 1:',
    layout
      .filter((cell) => cell !== EMPTY)
      .map((cell, index) => index * cell)
      .reduce(sum)
  );

  const [files, gaps] = getFilesAndGaps(input);
  const finalLayout: DiskSpace[] = getDiskLayout(files, gaps);

  console.log(
    'Part 2:',
    finalLayout
      .map((file) =>
        Array.from({ length: file.length }, (_, index) => file.start + index)
          .map((value) => value * file.id)
          .reduce(sum)
      )
      .reduce(sum)
  );
}

function getFilesAndGaps(input: number[]) {
  const gaps: DiskSpace[] = [];
  const files: DiskSpace[] = [];
  let free = false;
  let index = 0;
  let id = 0;

  for (const element of input) {
    const newEntry = {
      id: free ? EMPTY : id,
      start: index,
      length: element,
    };
    if (free) {
      gaps.push(newEntry);
    } else {
      files.push(newEntry);
      id++;
    }
    free = !free;
    index += element;
  }

  return [files, gaps];
}

function getDiskLayout(files: DiskSpace[], gaps: DiskSpace[]) {
  const layout: DiskSpace[] = [];

  while (files.length > 0) {
    const file = files.pop();
    for (const [index, gap] of gaps.entries()) {
      if (gap.length >= file.length && gap.start < file.start) {
        file.start = gap.start;
        gap.length -= file.length;
        gap.start += file.length;

        if (gap.length === 0) {
          gaps.splice(index, 1);
        }
        break;
      }
    }
    layout.push(file);
  }
  return layout;
}
