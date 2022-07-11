import { ORIENTATION, CURVE_DIRECTIONS, curvePath, edgePath } from
    './puzzleCurvePaths';

test('edge path', () => {
    const path = edgePath(ORIENTATION.HORIZONTAL, 100, CURVE_DIRECTIONS.UP, 30);
    expect(path).toBe('h35c30 -6 -30 -27 30 -30 60 3 0 24 30 30h35');
});