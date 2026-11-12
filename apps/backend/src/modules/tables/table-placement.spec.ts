import { nextFreePositions } from './table-placement';

const table = (posX: number, posY: number, width = 80, height = 80) => ({
  posX,
  posY,
  width,
  height,
});

describe('nextFreePositions', () => {
  it('starts at the top-left on an empty floor', () => {
    expect(nextFreePositions([], 2)).toEqual([
      { posX: 20, posY: 20 },
      { posX: 120, posY: 20 },
    ]);
  });

  it('skips a cell already used by an existing table', () => {
    expect(nextFreePositions([table(20, 20)], 1)).toEqual([
      { posX: 120, posY: 20 },
    ]);
  });

  it('skips a table that was dragged partly into a cell', () => {
    expect(nextFreePositions([table(60, 40)], 1)).toEqual([
      { posX: 220, posY: 20 },
    ]);
  });

  it('moves to the next row once the first row is full', () => {
    const firstRow = [0, 1, 2, 3, 4].map((i) => table(20 + i * 100, 20));
    expect(nextFreePositions(firstRow, 2)).toEqual([
      { posX: 20, posY: 120 },
      { posX: 120, posY: 120 },
    ]);
  });

  it('never places two tables of one batch on the same spot', () => {
    const placed = nextFreePositions([table(20, 20)], 7);
    const keys = placed.map((p) => `${p.posX},${p.posY}`);
    expect(new Set(keys).size).toBe(7);
    expect(keys).not.toContain('20,20');
  });
});
