import { validateLocaleAndSetLanguage } from 'typescript';
import './CurvedGrid.scss';

function validate(condition: boolean) {
    if (!condition) {
        throw Error();
    }
}

interface LinesGrid<T> {
    horizontal: T[][],
    vertical: T[][]
}

type SVGPath = string;
type Direction = 'up' | 'down' | 'left' | 'right'

const grid: LinesGrid<SVGPath> = {
    horizontal: [
        []
    ],
    vertical: [
        []
    ]
}

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

    // const CURVE_RELATIVE_HEIGHT = 0.2; // relative to the line length

    const // curveHeight = length * CURVE_RELATIVE_HEIGHT,
        curveBasisLength = 2 * curveSize,
        lineOrientation = curveDirection === 'up' || curveDirection === 'down' ?
            'h' : 'v',
        linePartLength = (length - curveBasisLength) / 2;

    const linePath = lineOrientation + linePartLength,
        curvePath = 'c' + CURVE_COORDINATES[curveDirection].map(
            n => n * curveSize).join(' '),
        fullPath = linePath + curvePath + linePath;

    return fullPath;
}

function CurvedGrid({
    imageWidth,
    imageHeight
}: {
    imageWidth: number,
    imageHeight: number
}) {
    const rows = 2,
        cols = 2,
        pieceWidth = imageWidth / cols,
        pieceHeight = imageHeight / rows,
        curveSize = Math.min(pieceWidth, pieceHeight) * 0.2;

    return <svg
        id="curved-grid"
        stroke="blue"
        strokeWidth="5"
        fill="none"
    >
        {/* <path d={`M${imageWidth / cols},0 v${imageHeight} M0,${imageHeight / rows} h${imageWidth}`} /> */}
        <path d={`M0,${imageHeight / rows} ${singleCurvedLinePath({
            length: imageWidth / cols,
            curveSize, 
            curveDirection: 'up'
        })}`} />
        <path d={`M${imageWidth / cols},${imageHeight / rows} ${singleCurvedLinePath({
            length: imageWidth / cols,
            curveSize, 
            curveDirection: 'down'
        })}`} />
        <path d={`M${imageWidth / cols},0 ${singleCurvedLinePath({
            length: imageHeight / rows,
            curveSize, 
            curveDirection: 'right'
        })}`} />
        <path d={`M${imageWidth / cols},${imageHeight / rows} ${singleCurvedLinePath({
            length: imageHeight / rows,
            curveSize, 
            curveDirection: 'left'
        })}`} />
    </svg>
}

export default CurvedGrid;