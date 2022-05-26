import { useState, useRef } from 'react';

const EXTRA_SPACE = 30;

function edgeClipPath({ edge, length, bumperSize }) {
    if (!['top', 'right', 'bottom', 'left'].includes(edge) ||
        length <= 0 ||
        bumperSize <= 0 ||
        bumperSize > length) {
        throw 'Bad argument';
    }

    let path;
    
    if (edge === 'top') {
        path = `
            h ${(length - bumperSize * 2) / 2}
            c   ${bumperSize} -${bumperSize * 0.2}
                -${bumperSize} -${bumperSize * 0.9}
                ${bumperSize} -${bumperSize}
            c   ${bumperSize * 2} ${bumperSize * 0.1} 
                0 ${bumperSize * 0.8}
                ${bumperSize} ${bumperSize}
            h ${(length - bumperSize * 2) / 2}
        `;
    } else if (edge === 'right') {        
        path = `
            v ${length / 2 - bumperSize}
            c   ${bumperSize * 0.2} ${bumperSize}
                ${bumperSize * 0.9} -${bumperSize}
                ${bumperSize} ${bumperSize}
            c   -${bumperSize * 0.1} ${bumperSize * 2}
                -${bumperSize * 0.8} 0
                -${bumperSize} ${bumperSize}
            v ${length / 2 - bumperSize}
        `;
    } else if (edge === 'bottom') {
        path = `
            h -${(length - bumperSize * 2) / 2}
            c   -${bumperSize} ${bumperSize * 0.2}
                ${bumperSize} ${bumperSize * 0.9}
                -${bumperSize} ${bumperSize}
            c   -${bumperSize * 2} -${bumperSize * 0.1} 
                0 -${bumperSize * 0.8}
                -${bumperSize} -${bumperSize}
            h -${length / 2 - bumperSize}
        `;
    } else if (edge === 'left') {        
        path = `
            v ${(length - bumperSize) / 2}
            c   ${bumperSize * 0.2} ${bumperSize}
                ${bumperSize * 0.9} -${bumperSize}
                ${bumperSize} ${bumperSize}
            c   -${bumperSize * 0.1} ${bumperSize * 2}
                -${bumperSize * 0.8} 0
                -${bumperSize} ${bumperSize}
            v ${length /2 - bumperSize}
        `;
    }

    return path.replace(/\s+/g, " ");

}

function makeClipPath(PIECE_WIDTH, PIECE_HEIGHT, BUMPER_WIDTH, BUMPER_HEIGHT) {
    return `"M${EXTRA_SPACE} ${EXTRA_SPACE}` +
        edgeClipPath({
            edge: 'top',
            length: PIECE_WIDTH,
            bumperSize: BUMPER_WIDTH
        }) +
        edgeClipPath({
            edge: 'right',
            length: PIECE_HEIGHT,
            bumperSize: BUMPER_HEIGHT
        }) +
        edgeClipPath({
            edge: 'bottom',
            length: PIECE_WIDTH,
            bumperSize: BUMPER_WIDTH
        }) +
        edgeClipPath({
            edge: 'left',
            length: PIECE_HEIGHT,
            bumperSize: BUMPER_HEIGHT
        }) +
        `z"`;
}


/*
 * @prop width {integer}
 * @prop height {integer}
 * @prop row {integer}
 * @prop col {integer}
 * @prop container {HTMLElement}
 * @prop zIndexArray {Element[]}
 */
function ImagePiece(props) {

	// debugLog(`<ImagePiece> (${props.row}, ${props.col}) is rendered`);

	const [position, setPosition] = useState({
			x: null,
			y: -props.height
		}),
		[dragState, setDragState] = useState(false),
		// [dragPinpoint, setDragPinpoint] = useState({
		// 	x: 0,
		// 	y: 0
		// }),
		ref = useRef(null);

	function normalizePosition(x, y) {
		if (typeof x === "object") {
			[x, y] = [x.x, x.y];
		}
		
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw "Bad argument";
		}

		const rect = props.container.getBoundingClientRect();
		return {
			x: x - rect.x,
			y: y - rect.y
		};
	}

	function startDrag(event) {
		// debugLog("startDrag");

		event.preventDefault();
		event.stopPropagation();

		const rect = event.target.getBoundingClientRect(),
			dragPinpoint = { x: event.clientX - rect.x, y: event.clientY - rect.y };
		//		setDragPinpoint({ x: event.clientX - rect.x, y: event.clientY - rect.y });
		setDragState(true);

		function globalPointerMoveEvent(event) {
			const rect = props.container.getBoundingClientRect(),
				newX = event.clientX - dragPinpoint.x - rect.x,
				newY = event.clientY - dragPinpoint.y - rect.y;

			setPosition({
				x: newX,
				y: newY
			});
		}

		document.addEventListener("pointermove", globalPointerMoveEvent);

		function stopDrag(event) {
			// debugLog("stopDrag", event.type);

			event.preventDefault();
			event.stopPropagation();

			document.removeEventListener("pointermove", globalPointerMoveEvent);
			setDragState(false);

			let { x, y } = normalizePosition(ref.current.getBoundingClientRect()),
				nearestXLine =
					x + props.width / 2 - ((x + props.width / 2) % props.width) - EXTRA_SPACE,
				nearestYLine =
					y + props.height / 2 - ((y + props.height / 2) % props.height) - EXTRA_SPACE;

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
		const arr = props.zIndexArray;

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
						props.width * -props.col + EXTRA_SPACE}px ${
						props.height * -props.row + EXTRA_SPACE}px`,
				'--EXTRA_SPACE': `${EXTRA_SPACE}px`,
                '--clip-path': makeClipPath(props.width, props.height, EXTRA_SPACE, EXTRA_SPACE),
				width: props.width + EXTRA_SPACE * 2,
				height: props.height + EXTRA_SPACE * 2,
				left: position.x,
				top: position.y,
				zIndex: dragState ? makeTop() : props.zIndexArray.indexOf(ref) + 1 || null
			}}
			onClick={dragState ? null : startDrag}
		/>
	);
}

export { ImagePiece };