import { randomizedCurveDirectionsGrid } from './SVGCurvePaths';

test('randomizedCurveDirectionsGrid()', () => {
    const rows = 2,
        cols = 3;
    const grid = randomizedCurveDirectionsGrid(rows, cols);

    expect(grid.horizontal).toBeInstanceOf(Array);
    expect(grid.horizontal.length).toBe(cols);
    expect(grid.horizontal[0].length).toBe(rows - 1);
    expect(grid.horizontal[0][0]).toMatch(/up|down/);
    expect(grid.horizontal
        [Math.trunc(Math.random() * cols)][Math.trunc(Math.random() * (rows - 1))]
    ).toMatch(/up|down/);

    expect(grid.vertical).toBeInstanceOf(Array);
    expect(grid.vertical.length).toBe(rows);
    expect(grid.vertical[0].length).toBe(cols - 1);
    expect(grid.vertical[0][0]).toMatch(/right|left/);
    expect(grid.vertical
        [Math.trunc(Math.random() * rows)][Math.trunc(Math.random() * (cols - 1))]
    ).toMatch(/right|left/);

});