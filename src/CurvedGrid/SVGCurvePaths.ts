import { validate } from '../utils';

type SVGPath = string;
type Direction = 'up' | 'down' | 'left' | 'right';

interface CurveDirectionsGrid {
    horizontal: ('up' | 'down')[][],
    vertical: ('right' | 'left')[][]
}

function randomizedCurveDirectionsGrid(rows: number, cols: number): CurveDirectionsGrid {
    return {
        horizontal: Array.from({ length: cols }, () =>
            Array.from({ length: rows - 1 }, () =>
                Math.random() < 0.5 ? 'up' : 'down')),

        vertical: Array.from({ length: rows }, () =>
            Array.from({ length: cols - 1 }, () =>
                Math.random() < 0.5 ? 'right' : 'left'))
    }
}

const CURVE_COORDINATES: {
    up: number[],
    right: number[],
    down: number[],
    left: number[]
} = {
    up: [
        1, -0.2, // control point
        -1, -0.9, // control point
        1, -1,
        2, 0.1, // control point
        0, 0.8, // control point
        1, 1
    ],
    down: [
        1, 0.2,
        -1, 0.9,
        1, 1,
        2, -0.1,
        0, -0.8,
        1, -1
    ],
    right: [
        0.2, 1,
        0.9, -1,
        1, 1,
        -0.1, 2,
        -0.8, 0,
        -1, 1
    ],
    left: [
        -0.2, 1,
        -0.9, -1,
        -1, 1,
        0.1, 2,
        0.8, 0,
        1, 1
    ]
};

function singleCurvedLinePath({
    length,
    curveSize,
    curveDirection
}: {
    length: number,
    curveSize: number,
    curveDirection: Direction
}): SVGPath {
    validate(
        length > 0 &&
        curveSize > 0 &&
        length > (2 * curveSize)
    );

    const curveBasisLength = 2 * curveSize,
        linePartLength = (length - curveBasisLength) / 2,
        lineOrientation =
            curveDirection === 'up' || curveDirection === 'down' ?
            'h' : 'v';

    const linePath = lineOrientation + linePartLength,
        curvePath = 'c' + CURVE_COORDINATES[curveDirection].map(
            n => n * curveSize).join(' '),
        fullPath = linePath + curvePath + linePath;

    return fullPath;
}

export { SVGPath, Direction };

export {
    randomizedCurveDirectionsGrid,
    singleCurvedLinePath
};