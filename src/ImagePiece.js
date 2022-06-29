import { useState, useRef, useMemo } from 'react';

const EXTRA_SPACE = 30;

function edgeClipPath({ lineLength, bumperSize, bumperDirection }) {

	if (!(lineLength >= 0) ||
		!(bumperSize >= 0) ||
		bumperSize >= lineLength
	) {
		throw Error('Bad size argument');
	}

	if (bumperSize === 0) {
		switch (bumperDirection) {
			case 'up':
			case 'down':
				return `h${lineLength}`;
			case 'left':
			case 'right':
				return `v${lineLength}`;
			default:
				throw Error('Bad direction argument');
		}
	}

	const bumperFactorMatrix = [
			[1, 0.2],
			[1, 0.9],
			[1, 1],
			[2, 0.1],
			[0, 0.8],
			[1, 1],
		].map(([x, y]) => ['up', 'down'].includes(bumperDirection) ?
			[x, y] : [y, x]
		).flat(),
		bumperDirectionMatrixes = {
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

	if (!(bumperDirectionMatrixes.hasOwnProperty(bumperDirection))
	) {
		throw Error('Bad direction argument');
	}

	const lineDirection = ['up', 'down'].includes(bumperDirection) ?
		'h' : 'v',
		linePart = `${lineDirection}${lineLength / 2 - bumperSize}`;

	const bumperCurvePath = 'c' + bumperDirectionMatrixes[bumperDirection].map(
		(value, index) =>
			value * bumperFactorMatrix[index] * bumperSize
		).join(' '),
		path = linePart + bumperCurvePath + linePart;

	return path;

}

function pieceClipPath(pieceWidth, pieceHeight, bumperWidth, bumperHeight, plainEdges = []) {

	const edgePaths = {
		top: plainEdges.top ?
			`h${pieceWidth}` :
			edgeClipPath({
				lineLength: pieceWidth,
				bumperSize: bumperWidth,
				bumperDirection: 'down'
			}),	
		right: plainEdges.right ?
			`v${pieceHeight}` :
			edgeClipPath({
				lineLength: pieceHeight,
				bumperSize: bumperHeight,
				bumperDirection: 'right'
			}),	
		left: plainEdges.left ?
			`v${pieceHeight}` :
			edgeClipPath({
				lineLength: pieceHeight,
				bumperSize: bumperHeight,
				bumperDirection: 'right'
			}),	
		bottom: plainEdges.bottom ?
			`h${pieceWidth}` :
			edgeClipPath({
				lineLength: pieceWidth,
				bumperSize: bumperWidth,
				bumperDirection: 'down'
			})
	}

    return '"' +
		`M${EXTRA_SPACE} ${EXTRA_SPACE}` +
        edgePaths.top +
        edgePaths.right +
		`M${EXTRA_SPACE} ${EXTRA_SPACE}` +
        edgePaths.left +
        edgePaths.bottom +
		'"';
}

function ImagePiece({
	width,
	height,
	row, /* 1-based */
	col, /* 1-based */
	plainEdges,
	container,
	zIndexArray
}) {

	const [position, setPosition] = useState({
			x: null,
			y: -height
		}),
		[dragState, setDragState] = useState(false),
		ref = useRef(null);

	function normalizePosition(x, y) {
		if (typeof x === "object") {
			({x, y} = x);
		}
		
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw Error("Bad argument");
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

		document.addEventListener('click', stopDrag, {
			capture: true,
			once: true
		});
	}

	function makeTop() {
		const arr = zIndexArray;

		for (let i of arr) {
			if (arr[i] === ref) {
				arr.splice(i, 1);
				break;
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
						width * -(col - 1) + EXTRA_SPACE}px ${
						height * -(row - 1) + EXTRA_SPACE}px`,
				'--EXTRA_SPACE': `${EXTRA_SPACE}px`,
                '--clip-path': useMemo(
                    () => pieceClipPath(width, height, EXTRA_SPACE, EXTRA_SPACE, plainEdges),
                    [width, height, plainEdges]),
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