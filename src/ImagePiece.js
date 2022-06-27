import { useState, useRef, useMemo } from 'react';

const EXTRA_SPACE = 30;

function edgeClipPath({ lineDirection, lineLength, bumpDirection, /*deprecated*/ edge, bumperSize }) {

    if (/* !['up', 'down', 'right', 'left'].includes(lineDirection) ||
    !['clockwise', 'counterclockwise'].includes(bumpDirection) || */
    lineLength <= 0 ||
    bumperSize <= 0 ||
    bumperSize > lineLength) {
        throw 'Bad argument';
    }

    const factorsMatrix = [
        [1, -0.2],
        [-1, -0.9],
        [1, -1],
        [2, 0.1],
        [0, 0.8],
        [1, 1],
    ];

    const pointsMatrix = factorsMatrix.flat().map(n => n * bumperSize);

    let path;
    
    if (edge === 'top') {
        path = `
            h ${(lineLength - bumperSize * 2) / 2}
            c ${pointsMatrix.join(' ')}
            h ${(lineLength - bumperSize * 2) / 2}
        `;
    } else if (edge === 'right') {        
        path = `
            v ${lineLength / 2 - bumperSize}
            c   ${bumperSize * 0.2} ${bumperSize}
                ${bumperSize * 0.9} -${bumperSize}
                ${bumperSize} ${bumperSize}
            c   -${bumperSize * 0.1} ${bumperSize * 2}
                -${bumperSize * 0.8} 0
                -${bumperSize} ${bumperSize}
            v ${lineLength / 2 - bumperSize}
        `;
    } else if (edge === 'bottom') {
        path = `
            h -${(lineLength - bumperSize * 2) / 2}
            c   -${bumperSize} ${bumperSize * 0.2}
                ${bumperSize} ${bumperSize * 0.9}
                -${bumperSize} ${bumperSize}
            c   -${bumperSize * 2} -${bumperSize * 0.1} 
                0 -${bumperSize * 0.8}
                -${bumperSize} -${bumperSize}
            h -${lineLength / 2 - bumperSize}
        `;
    } else if (edge === 'left') {        
        path = `
            v ${(lineLength - bumperSize) / 2}
            c   ${bumperSize * 0.2} ${bumperSize}
                ${bumperSize * 0.9} -${bumperSize}
                ${bumperSize} ${bumperSize}
            c   -${bumperSize * 0.1} ${bumperSize * 2}
                -${bumperSize * 0.8} 0
                -${bumperSize} ${bumperSize}
            v ${lineLength /2 - bumperSize}
        `;
    }

    return path.replace(/\s+/g, " ");

}

function makeClipPath(PIECE_WIDTH, PIECE_HEIGHT, BUMPER_WIDTH, BUMPER_HEIGHT) {
    return `"M${EXTRA_SPACE} ${EXTRA_SPACE}` +
        edgeClipPath({
            edge: 'top',
            lineLength: PIECE_WIDTH,
            bumperSize: BUMPER_WIDTH
        }) +
        edgeClipPath({
            edge: 'right',
            lineLength: PIECE_HEIGHT,
            bumperSize: BUMPER_HEIGHT
        }) +
        edgeClipPath({
            edge: 'bottom',
            lineLength: PIECE_WIDTH,
            bumperSize: BUMPER_WIDTH
        }) +
        edgeClipPath({
            edge: 'left',
            lineLength: PIECE_HEIGHT,
            bumperSize: BUMPER_HEIGHT
        }) +
        `z"`;
}

function ImagePiece({ width, height, row, col, container, zIndexArray }) {

	const [position, setPosition] = useState({
			x: null,
			y: -height
		}),
		[dragState, setDragState] = useState(false),
		ref = useRef(null);

	function normalizePosition(x, y) {
		if (typeof x === "object") {
			[x, y] = [x.x, x.y];
		}
		
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw "Bad argument";
		}

		const rect = container.getBoundingClientRect();
		return {
			x: x - rect.x,
			y: y - rect.y
		};
	}

	function startDrag(event) {

		event.preventDefault();
		event.stopPropagation();

		const rect = event.target.getBoundingClientRect(),
			dragPinpoint = {
				x: event.clientX - rect.x,
				y: event.clientY - rect.y
			};
		setDragState(true);

		function globalPointerMoveEvent(event) {
			const rect = container.getBoundingClientRect(),
				newX = event.clientX - dragPinpoint.x - rect.x,
				newY = event.clientY - dragPinpoint.y - rect.y;

			setPosition({
				x: newX,
				y: newY
			});
		}

		document.addEventListener("pointermove", globalPointerMoveEvent);

		function stopDrag(event) {

			event.preventDefault();
			event.stopPropagation();

			document.removeEventListener("pointermove", globalPointerMoveEvent);
			setDragState(false);

			let { x, y } = normalizePosition(ref.current.getBoundingClientRect()),
				nearestXLine =
					x + width / 2 - ((x + width / 2) % width) - EXTRA_SPACE,
				nearestYLine =
					y + height / 2 - ((y + height / 2) % height) - EXTRA_SPACE;

			if (Math.abs(x - nearestXLine) < 20) {
				x = nearestXLine;
			}
			if (Math.abs(y - nearestYLine) < 20) {
				y = nearestYLine;
			}

			setPosition({
				x: x,
				y: y
			});
		}

		["click" /* , "mouseout", "blur" */].forEach((eventName) => {
			document.addEventListener(eventName, stopDrag, {
				capture: true,
				once: true
			});
		});
	}

	function makeTop() {
		const arr = zIndexArray;

		for (let i = 0; i < arr.length; i++) {
			if (arr[i] === ref) {
				arr.splice(i, 1);
			}
		}
		arr.push(ref);
		return arr.length;
	}

	return (
		<div
			ref={ref}
			className={"image-piece" + (dragState ? " selected" : "")}
			style={{
				backgroundPosition:
					`${
						width * -col + EXTRA_SPACE}px ${
						height * -row + EXTRA_SPACE}px`,
				'--EXTRA_SPACE': `${EXTRA_SPACE}px`,
                '--clip-path': useMemo(
                    () => makeClipPath(width, height, EXTRA_SPACE, EXTRA_SPACE),
                    [width, height, EXTRA_SPACE]),
				width: width + EXTRA_SPACE * 2,
				height: height + EXTRA_SPACE * 2,
				left: position.x,
				top: position.y,
				zIndex: dragState ? makeTop() : zIndexArray.indexOf(ref) + 1 || null
			}}
			onClick={dragState ? null : startDrag}
		/>
	);
}

export { ImagePiece };