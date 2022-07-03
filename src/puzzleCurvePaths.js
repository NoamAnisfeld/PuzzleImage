const ORIENTATION = Object.freeze({
	HORIZONTAL: {},
	VERTICAL: {}
});

const CURVE_DIRECTIONS = Object.freeze({
	// NONE: {},
	UP: {},
	RIGHT: {},
	DOWN: {},
	LEFT: {}
});

function curvePath(direction, size) {

    if (!Object.values(CURVE_DIRECTIONS).includes(direction) ||
        // direction === CURVE_DIRECTIONS.NONE ||
        !(size > 0)
    ) {
        throw Error('bad argument');
    }

    const factorMatrix1 = [
            [0.5, 0.1],
            [0.5, 0.45],
            [0.5, 0.5],
            [1, 0.05],
            [0, 0.4],
            [0.5, 0.5],
        ].map(([x, y]) =>
            [CURVE_DIRECTIONS.UP, CURVE_DIRECTIONS.DOWN].includes(direction) ?
            [x, y] : [y, x]
        ).flat();

    const factorMatrix2 = (
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
            (direction === CURVE_DIRECTIONS.LEFT) ? [
                [-1, 1],
                [-1, -1],
                [-1, 1],
                [1, 1],
                [1, 1],
                [1, 1]
            ] : null
        ).flat();

        const path = 'c' + factorMatrix1.map(
            (value, index) =>
                value * factorMatrix2[index] * size
            ).join(' ');

        return path;
}

function edgePath(orientation, size, curveDirection, curveSize) {
    if (!Object.values(ORIENTATION).includes(orientation) ||
        !Object.values(CURVE_DIRECTIONS).includes(curveDirection) ||
        !(size > 0) ||
        // (curveDirection !== CURVE_DIRECTIONS.NONE && (
            !(curveSize > 0) ||
            curveSize >= size
        // ))
    ) {
        throw Error("bad argument");
    }

    const lineMark = (orientation === ORIENTATION.HORIZONTAL) ? 'h' : 'v';

    // if (curveDirection === CURVE_DIRECTIONS.NONE) {
    //     return `${lineMark}${size}`;
    // } else {
        const linePart = `${lineMark}${(size - curveSize) / 2}`;
        return `${linePart}${curvePath(curveDirection, curveSize)}${linePart}`;
    // }
}

function edgePaths({ pieceWidth, pieceHeight }) {
    if (!(pieceWidth > 0 && pieceHeight > 0)) {
        throw Error('bad argument');
    }

    const curveSize = Math.min(pieceWidth, pieceHeight) * 0.5;

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
        horizontal: Array(cols).fill().map(() =>
                Array(rows - 1).fill().map(() =>
                    Math.random() < 0.5 ?
                    curvedUp : curvedDown
                )
            ),
        vertical: Array(rows).fill().map(() =>
                Array(cols - 1).fill().map(() =>
                    Math.random() < 0.5 ?
                    curvedRight : curvedLeft
                )
            )
    });
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

function SVGFromPath( { path, ...attrs }) {
    return <svg {...attrs}>
        <path d={path} />
    </svg>
}

export {
    ORIENTATION,
    CURVE_DIRECTIONS,
    curvePath,
    edgePath,
    edgePaths,
    randomizedCurvedPathGrid,
    curvedGridCombinedPath,
    dataUrlShapeFromPath,
    SVGFromPath
};