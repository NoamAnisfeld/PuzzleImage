import { validate } from '../utils';

type SVGPath = string;
type HorizontalDirection = 'right' | 'left';
type VerticalDirection = 'up' | 'down';
type Direction = HorizontalDirection | VerticalDirection;

interface CurveDirectionsGrid {
    horizontal: ('up' | 'down')[][],
    vertical: ('right' | 'left')[][]
}

interface SVGPathsGrid {
    horizontal: SVGPath[][],
    vertical: SVGPath[][]
}

interface BoxWithCurvedEdges {
    top?: Direction,
    right?: Direction,
    bottom?: Direction,
    left?: Direction,
}

function limitPrecision(n: number) {
    return Math.round(n * 100) / 100;
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
        linePartLength = limitPrecision((length - curveBasisLength) / 2),
        lineOrientation =
            curveDirection === 'up' || curveDirection === 'down' ?
            'h' : 'v';

    const linePath = lineOrientation + linePartLength,
        curvePath = 'c' + CURVE_COORDINATES[curveDirection].map(
            n => limitPrecision(n * curveSize)).join(' '),
        fullPath = linePath + curvePath + linePath;

    return fullPath;
}

function mapCurveDirectionsGridToSVGPathsGrid({
    directionsGrid,
    pieceWidth,
    pieceHeight,
    curveSize
}: {
    directionsGrid: CurveDirectionsGrid,
    pieceWidth: number,
    pieceHeight: number,
    curveSize: number
}): SVGPathsGrid {
    validate(
        [pieceWidth, pieceHeight, curveSize].every(value => value > 0) &&
        [pieceWidth, pieceHeight].every(value => value > curveSize * 2)
    );

    const { horizontal, vertical } = directionsGrid;

    return {
        horizontal: horizontal.map(array =>
            array.map(value => singleCurvedLinePath({
                length: pieceWidth,
                curveSize,
                curveDirection: value
            }))
        ),

        vertical: vertical.map(array =>
            array.map(value => singleCurvedLinePath({
                length: pieceHeight,
                curveSize,
                curveDirection: value
            }))
        )
    };
}

function combinedSVGPathFromPathsGrid({
    grid,
    pieceWidth,
    pieceHeight
}:{
    grid: SVGPathsGrid,
    pieceWidth: number,
    pieceHeight: number
}) {
    let path = '';

    for (let col = 0; col < grid.horizontal.length; col++) {
        const x = limitPrecision(pieceWidth * col);

        for (let row = 0; row < grid.horizontal[col].length; row++) {
            const y = limitPrecision(pieceHeight * (row + 1));

            path += `M${x},${y}${grid.horizontal[col][row]}`;
        }
    }

    for (let row = 0; row < grid.vertical.length; row++) {
        const y = limitPrecision(pieceHeight * row);

        for (let col = 0; col < grid.vertical[row].length; col++) {
            const x = limitPrecision(pieceWidth * (col + 1));

            path += `M${x},${y}${grid.vertical[row][col]}`;
        }
    }

    return path;
}

function extractPieceOutlinePath({
    grid,
    row,
    col,
    pieceWidth,
    pieceHeight,
    curveSize
}: {
    grid: SVGPathsGrid,
    row: number,
    col: number,
    pieceWidth: number,
    pieceHeight: number,
    curveSize: number
}): SVGPath {
    const rowsInCol = grid.horizontal[col],
        colsInRow = grid.vertical[row];
    
    validate(
        rowsInCol instanceof Array &&
        colsInRow instanceof Array
    );
    
    const
        top =
            row === 0 ? `h${pieceWidth}` : rowsInCol[row - 1],
        bottom =
            row === rowsInCol.length ? `h${pieceWidth}` : rowsInCol[row],
        left = 
            col === 0 ? `v${pieceHeight}` : colsInRow[col - 1],
        right =
            col === colsInRow.length ? `v${pieceHeight}` : colsInRow[col];

    return `M${curveSize},${curveSize}${top}${right}` +
        `M${curveSize},${curveSize}${left}${bottom}`;
}

// types and interfaces
export { 
    Direction,
    CurveDirectionsGrid,
    SVGPath,
    SVGPathsGrid
};

// actual objects
export {
    randomizedCurveDirectionsGrid,
    singleCurvedLinePath,
    mapCurveDirectionsGridToSVGPathsGrid,
    combinedSVGPathFromPathsGrid,
    extractPieceOutlinePath
};