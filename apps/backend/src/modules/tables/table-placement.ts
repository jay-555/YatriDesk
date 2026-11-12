export interface PlacedRect {
  posX: number;
  posY: number;
  width: number;
  height: number;
}

const ORIGIN = 20;
const STEP = 100;
const COLUMNS = 5;

function overlaps(a: PlacedRect, b: PlacedRect) {
  return (
    a.posX < b.posX + b.width &&
    b.posX < a.posX + a.width &&
    a.posY < b.posY + b.height &&
    b.posY < a.posY + a.height
  );
}

/**
 * Free grid cells for `count` new tables of the given size, scanning a
 * 5-column grid row by row and skipping any cell that would overlap a table
 * already on the floor (or one placed earlier in the same batch).
 */
export function nextFreePositions(
  existing: PlacedRect[],
  count: number,
  width = 80,
  height = 80,
): { posX: number; posY: number }[] {
  const taken = [...existing];
  const result: { posX: number; posY: number }[] = [];
  for (let cell = 0; result.length < count; cell++) {
    const candidate: PlacedRect = {
      posX: ORIGIN + (cell % COLUMNS) * STEP,
      posY: ORIGIN + Math.floor(cell / COLUMNS) * STEP,
      width,
      height,
    };
    if (taken.some((t) => overlaps(candidate, t))) continue;
    taken.push(candidate);
    result.push({ posX: candidate.posX, posY: candidate.posY });
  }
  return result;
}
