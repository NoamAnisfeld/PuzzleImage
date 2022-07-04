import { useState, useRef } from 'react';
import { dataUrlShapeFromPath } from './puzzleCurvePaths';

function ImagePiece({
	width,
	height,
	row,
	col,
	curveSize,
	path,
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
					x + width / 2 - ((x + width / 2) % width) - curveSize,
				nearestYLine =
					y + height / 2 - ((y + height / 2) % height) - curveSize;

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

	const clipPath = path;

	return (
		<div
			ref={ref}
			className={"image-piece" + (dragState ? " selected" : "")}
			style={{
				'--EXTRA_SPACE': `${curveSize}px`,
                '--clip-path': `"${clipPath}"`,
				backgroundImage:
					`url("${dataUrlShapeFromPath(clipPath)}"), var(--image)`,
				backgroundPosition:
					'0 0, ' +
					`${width * -(col) + curveSize}px ` +
					`${height * -(row) + curveSize}px`,
				width: width + curveSize * 2,
				height: height + curveSize * 2,
				left: position.x,
				top: position.y,
				zIndex: dragState ? makeTop() : zIndexArray.indexOf(ref) + 1 || null
			}}
			onClick={dragState ? null : startDrag}
		/>
	);
}

export { ImagePiece };