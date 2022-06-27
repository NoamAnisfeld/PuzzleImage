import { useState, useRef, useMemo } from 'react';

const EXTRA_SPACE = 30;

function edgeClipPath({ lineLength, bumperSize, bumperDirection }) {

	if (!(lineLength >= 0) ||
		!(bumperSize >= 0) ||
		bumperSize >= lineLength
	) {
		throw Error('Bad size argument');
	}

	const bumperMatrix = [
			[1, 0.2],
			[1, 0.9],
			[1, 1],
			[2, 0.1],
			[0, 0.8],
			[1, 1],
		].map(([x, y]) => ['up', 'down'].includes(bumperDirection) ?
			[x, y] : [y, x]
		).flat(),
		bumperFactorMatrixes = {
			up: [
				[1, -1],
				[-1, -1],
				[1, -1],
				[1, 1],
				[1, 1],
				[1, 1]
			].flat(),
			right: [
				[1, 1],
				[1, -1],
				[1, 1],
				[-1, 1],
				[-1, 1],
				[-1, 1]
			].flat(),
			left: [
				[-1, 1],
				[-1, -1],
				[-1, 1],
				[1, 1],
				[1, 1],
				[1, 1]
			].flat(),
			down: [
				[1, -1],
				[-1, 1],
				[1, 1],
				[1, -1],
				[1, -1],
				[1, -1]
			].flat()
		};

	if (!(bumperFactorMatrixes.hasOwnProperty(bumperDirection))
	) {
		throw Error('Bad direction argument');
	}

	const lineDirection = ['up', 'down'].includes(bumperDirection) ?
		'h' : 'v',
		linePart = `${lineDirection}${lineLength / 2 - bumperSize}`;

	const bumperCurvePath = 'c' + bumperMatrix.map(
		(value, index) =>
			value * bumperFactorMatrixes[bumperDirection][index] * bumperSize
		).join(' '),
		path = linePart + bumperCurvePath + linePart;

	return path;

}

function makeClipPath(PIECE_WIDTH, PIECE_HEIGHT, BUMPER_WIDTH, BUMPER_HEIGHT) {
    return '"' +
		`M${EXTRA_SPACE} ${EXTRA_SPACE}` +
        edgeClipPath({
            lineLength: PIECE_WIDTH,
            bumperSize: BUMPER_WIDTH,
			bumperDirection: 'down'
        }) +
        edgeClipPath({
            lineLength: PIECE_HEIGHT,
            bumperSize: BUMPER_HEIGHT,
			bumperDirection: 'right'
        }) +
		`M${EXTRA_SPACE} ${EXTRA_SPACE}` +
		edgeClipPath({
            lineLength: PIECE_HEIGHT,
            bumperSize: BUMPER_HEIGHT,
			bumperDirection: 'right'
        }) +
        edgeClipPath({
            lineLength: PIECE_WIDTH,
            bumperSize: BUMPER_WIDTH,
			bumperDirection: 'down'
        }) +
		'"';
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