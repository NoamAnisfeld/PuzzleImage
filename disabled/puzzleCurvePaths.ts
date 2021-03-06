enum ORIENTATION {
	HORIZONTAL,
	VERTICAL
};

enum CURVE_DIRECTIONS {
	UP,
	RIGHT,
	DOWN,
	LEFT,
};

interface gridParams {
    rows: number,
    cols: number,
    fillFunction: (arg0: {
        row: number; col: number;
    }) => unknown
}

class GridLines {
    horizontal: any[][]
    vertical: any[][]

    constructor({ rows, cols, fillFunction }:gridParams) {

        if (!Number.isInteger(rows) ||
            !Number.isInteger(cols) ||
            !(rows > 0) ||
            !(cols > 0) ||
            !(fillFunction instanceof Function)
        ) {
            throw Error('bad argument');
        }

        this.horizontal = Array.from({ length: cols }, (_: never, col) => {
            return Array.from({ length: rows - 1}, (_: never, row) =>
                fillFunction({ row, col }));
        });

        this.vertical = Array.from({ length: rows }, (_: never, row) => {
            return Array.from({ length: cols - 1}, (_: never, col) =>
                fillFunction({ row, col }));
        });
    }
}

// class CurvePathsGrid {
// 	width
// 	height
// 	rows
// 	cols
// 	horizontal
// 	vertical

// 	constructor({ width, height, rows, cols, curveSize, pathFunction }) {
// 		const pieceWidth = width / cols,
// 			pieceHeight = height / rows;

// 		Object.assign(this, { width, height, rows, cols });

// 		this.horizontal = Array.from({ length: cols }, () =>
// 			Array.from({ length: rows - 1 }, pathFunction({
// 				orientation: ORIENTATION.HORIZONTAL,
// 				size: pieceWidth,
// 				curveSize,
// 				curveDirection: Math.random() < 0.5 ?
// 					CURVE_DIRECTIONS.UP : CURVE_DIRECTIONS.DOWN
// 			})));
		
// 		this.vertical = Array.from({ length: rows }, () =>
// 			Array.from({ length: cols - 1 },  pathFunction({
// 				orientation: ORIENTATION.VERTICAL,
// 				curveSize,
// 				size: pieceHeight,
// 				curveDirection: Math.random() < 0.5 ?
// 					CURVE_DIRECTIONS.RIGHT : CURVE_DIRECTIONS.LEFT
// 			})));
// 	}
// }

function curvePath(direction:CURVE_DIRECTIONS, size:number, basisLength:number) {

    if (/* !Object.values(CURVE_DIRECTIONS).includes(direction) || */
        !(size > 0) ||
        !(basisLength > 0)
    ) {
        throw Error('bad argument');
    }

    const factorsMatrix = [
            [basisLength,     0.2 * size],
            [basisLength,     0.9 * size],
            [basisLength,     size],
            [2 * basisLength, 0.1 * size],
            [0,               0.8 * size],
            [basisLength,     size],
        ].map(([x, y]) =>
            [CURVE_DIRECTIONS.UP, CURVE_DIRECTIONS.DOWN].includes(direction) ?
            [x, y] : [y, x]
        ).flat();

    const directionsMatrix = (
            (direction === CURVE_DIRECTIONS.UP) ? [
                [1, -1],
                [-1, -1],
                [1, -1],
                [1, 1],
                [1, 1],
                [1, 1]
            ] :
            (direction === CURVE_DIRECTIONS.RIGHT) ? [
                [1, 1],
                [1, -1],
                [1, 1],
                [-1, 1],
                [-1, 1],
                [-1, 1]
            ] :
            (direction === CURVE_DIRECTIONS.DOWN) ? [
                [1, -1],
                [-1, 1],
                [1, 1],
                [1, -1],
                [1, -1],
                [1, -1]
            ] :
            /* (direction === CURVE_DIRECTIONS.LEFT) ? */ [
                [-1, 1],
                [-1, -1],
                [-1, 1],
                [1, 1],
                [1, 1],
                [1, 1]
            ]
        ).flat();

        const path = 'c' + factorsMatrix.map(
            (value, index) =>
                value * directionsMatrix[index]
            ).join(' ');

        return path;
}

function edgePath(orientation, size, curveDirection, curveSize) {
    if (!Object.values(ORIENTATION).includes(orientation) ||
        !Object.values(CURVE_DIRECTIONS).includes(curveDirection) ||
        !(size > 0) ||
        // (curveDirection !== CURVE_DIRECTIONS.NONE && (
            !(curveSize > 0) ||
            curveSize >= size / 2
        // ))
    ) {
        throw Error("bad argument");
    }

    const lineMark = (orientation === ORIENTATION.HORIZONTAL) ? 'h' : 'v';
    const linePart = `${lineMark}${(size - 2 * curveSize) / 2}`;
    const basisLength = curveSize * 2;
    return `${linePart}${curvePath(curveDirection, curveSize, basisLength)}${linePart}`;
}

function edgePaths({ pieceWidth, pieceHeight, curveSize }) {
    if (!(pieceWidth > 0 && pieceHeight > 0)) {
        throw Error('bad argument');
    }

    return {
        horizontalPlain: `h${pieceWidth}`,
        verticalPlain: `v${pieceHeight}`,
        curvedUp: edgePath(
            ORIENTATION.HORIZONTAL,
            pieceWidth,
            CURVE_DIRECTIONS.UP,
            curveSize
        ),
        curvedDown: edgePath(
            ORIENTATION.HORIZONTAL,
            pieceWidth,
            CURVE_DIRECTIONS.DOWN,
            curveSize
        ),
        curvedRight: edgePath(
            ORIENTATION.VERTICAL,
            pieceHeight,
            CURVE_DIRECTIONS.RIGHT,
            curveSize
        ),
        curvedLeft: edgePath(
            ORIENTATION.VERTICAL,
            pieceHeight,
            CURVE_DIRECTIONS.LEFT,
            curveSize
        )
    };
}

function randomizedCurvedPathGrid({ curvedUp, curvedRight, curvedDown, curvedLeft, cols, rows }) {

    return({
        horizontal: Array.from({length: cols}, () =>
                Array.from({length: rows - 1}, () =>
                    Math.random() < 0.5 ?
                    curvedUp : curvedDown
                )
            ),
        vertical: Array.from({length: rows}, () =>
                Array.from({length: cols - 1}, () =>
                    Math.random() < 0.5 ?
                    curvedRight : curvedLeft
                )
            )
    });
}

function piecePath({ row, col, pathGrid, curveSize, pieceWidth, pieceHeight }) {

    const top = (row === 0) ?
            `h${pieceWidth}` : pathGrid.horizontal[col][row - 1],
        right = (col === pathGrid.horizontal.length - 1) ?
            `v${pieceHeight}` : pathGrid.vertical[row][col],
        left = (col === 0) ?
            `v${pieceHeight}` : pathGrid.vertical[row][col - 1],
        bottom = (row === pathGrid.vertical.length - 1) ?
            `h${pieceWidth}` : pathGrid.horizontal[col][row];

    if (!(top && right && left && bottom)) {
        console.warn({top, right, left, bottom});
    }

    return `M${curveSize},${curveSize}${top}${right}M${curveSize},${curveSize}${left}${bottom}`;
}

function curvedGridCombinedPath({ horizontalPaths, verticalPaths, pieceWidth, pieceHeight }) {

    // ToDo: A deeper validation or perhaps a different validation method
    if (!(horizontalPaths instanceof Array) ||
        !(verticalPaths instanceof Array)
    ) {
        throw Error('bad argument');
    }

    return [
        ...(horizontalPaths.map((col, colIndex) =>
            col.map((path, rowIndex) => 
                `M${(colIndex) * pieceWidth},${(rowIndex + 1) * pieceHeight}${path}`
            )
        ).flat()),
        ...(verticalPaths.map((row, rowIndex) =>
            row.map((path, colIndex) => 
                `M${(colIndex + 1) * pieceWidth},${(rowIndex) * pieceHeight}${path}`
            )
        ).flat())
    ].join('');
}

function dataUrlShapeFromPath(path, {
	strokeColor = '#FFF',
	strokeWidth = 1,
	fill = 'transparent'
} = {}) {
	path = path.replace(/"/g, '');

	path = `data:image/svg+xml,${encodeURIComponent(
			`<svg xmlns='http://www.w3.org/2000/svg'>
				<path d='${path}'
					stroke='${strokeColor}'
					stroke-width='${strokeWidth}'
					fill='${fill}'
				/>
			</svg>`)
		}`;

    console.log(path);
    return path;
}

// function SVGFromPath( { path, ...attrs }) {
//     return <svg {...attrs}>
//         <path d={path} />
//     </svg>
// }

export {
    ORIENTATION,
    CURVE_DIRECTIONS,
    curvePath,
    edgePath,
    edgePaths,
    randomizedCurvedPathGrid,
    piecePath,
    curvedGridCombinedPath,
    dataUrlShapeFromPath,
    // SVGFromPath
};