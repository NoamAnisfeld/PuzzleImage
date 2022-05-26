import './App.scss';
import { useState, useEffect, useRef } from 'react';
import { defaultSettings, SettingsPanel } from './SettingsPanel.js';

// ***** Debugging Utilities *****
const debugConsole = document.getElementById("debug-console");

function debugLog(...args) {
  const outputArray = args.map((arg) => {
      if (arg instanceof HTMLElement) {
        return `<${arg.tagName.toLowerCase()}>`;
      } else if (arg && typeof arg === "object") {
        return JSON.stringify(arg);
      } else {
        return String(arg);
      }
    }),
    outputStr = outputArray.join(", ");

  debugConsole.textContent = outputStr;
  console.log(outputStr);

  return args[0];

	// document.body.addEventListener("mousemove", (e) => {
	// 	debugLog("mousemove", e.target, e.currentTarget, e.clientX, e.clientY);
	// });
}

// ***** App *****
// const ROUND_FACTOR = 10;

function factorRound(num, factor) {
	return Math.round(num / factor) * factor;
}

function factorFloor(num, factor) {
	return num - (num % factor);
}

function factorCeil(num, factor) {
	return num - (num % factor) + factor;
}

// defaultSettings.imageWidth = factorRound(
// 	defaultSettings.imageWidth,
// 	ROUND_FACTOR * defaultSettings.cols
// );

/*
 * @prop width {integer}
 * @prop height {integer}
 * @prop row {integer}
 * @prop col {integer}
 * @prop container {HTMLElement}
 * @prop zIndexArray {Element[]}
 */
function ImagePiece(props) {
	debugLog(`<ImagePiece> (${props.row}, ${props.col}) is rendered`);

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

		const rect = props.container.getBoundingClientRect();
		return {
			x: x - rect.x,
			y: y - rect.y
		};
	}

	function startDrag(event) {
		debugLog("startDrag");

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
			debugLog("stopDrag", event.type);

			event.preventDefault();
			event.stopPropagation();

			document.removeEventListener("pointermove", globalPointerMoveEvent);
			setDragState(false);

			let { x, y } = normalizePosition(ref.current.getBoundingClientRect()),
				nearestXLine = x + props.width / 2 - ((x + props.width / 2) % props.width),
				nearestYLine =
					y + props.height / 2 - ((y + props.height / 2) % props.height);

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
				backgroundPosition: `${props.width * -props.col}px ${
					props.height * -props.row
				}px`,
				width: props.width,
				height: props.height,
				left: position.x,
				top: position.y,
				zIndex: dragState ? makeTop() : props.zIndexArray.indexOf(ref) + 1 || null
			}}
			onClick={dragState ? null : startDrag}
			// onPointerDown={dragState ? null : startDrag}
			// onPointerUp={dragState ? stopDrag : null}
			// onPointerOut={dragState ? stopDrag : null}
			// onPointerMove={dragState ? dragMove : null}
		/>
	);
}

/*
 * @prop imageWidth {integer}
 * @prop imageHeight {integer}
 * @prop rows {integer}
 * @prop cols {integer}
 * @prop zIndexArray {Element[]}
 */
function GameBoard(props) {
	debugLog("<GameBoard> is rendered");

	const [puzzleFrameRect, setPuzzleFrameRect] = useState(),
		ref = useRef(null);

	useEffect(() => {
		if (!puzzleFrameRect) {
			setPuzzleFrameRect(ref.current.getBoundingClientRect());
		}
	});

	function makePieces(container) {
		const array = [];
		for (let row = 0; row < props.rows; row++) {
			for (let col = 0; col < props.cols; col++) {
				array.push(
					<ImagePiece
						container={container}
						width={props.imageWidth / props.cols}
						height={props.imageHeight / props.rows}
						row={row}
						col={col}
						zIndexArray={props.zIndexArray}
					/>
				);
			}
		}
		return array;
	}

	return (
		<div id="game-wrapper">
			<div id="puzzle-frame" ref={ref}>
				{makePieces(ref.current)}
			</div>
		</div>
	);
}

/*
 * @prop zIndexArray {Element[]}
 */
function App(props) {
	debugLog("<App> is rendered");

	const // ref = useRef(null),
		// puzzleFrameRef = useRef(null),
		// [rect, setRect] = useState(document.body.getBoundingClientRect()),
		// [puzzleFrameRect, setPuzzleFrameRect] = useState(
		// 	document.body.getBoundingClientRect()
		// ),
		[imageUrl, setImageUrl] = useState(defaultSettings.imageUrl),
		[imageWidth, setImageWidth] = useState(defaultSettings.imageWidth),
		[imageHeight, setImageHeight] = useState(0),
		[rows, setRows] = useState(defaultSettings.rows),
		[cols, setCols] = useState(defaultSettings.cols),
		// [pieces, setPieces] = useState({
		// 	rows: defaultSettings.rows,
		// 	cols: defaultSettings.cols
		// }),
		// [imageDimensions, setImageDimensions] = useState({
		// 	width: defaultSettings.imageWidth
		// }),
		[gameStarted, setGameStarted] = useState(false);

	// useEffect(() => {
	//			setRect(ref.current.getBoundingClientRect());
	// if (puzzleFrameRef.current) {
	// 	setPuzzleFrameRect(puzzleFrameRef.current.getBoundingClientRect());
	// }
	// });

	// 	function initImage(imageUrl) {
	// 		return (
	// 			<ImageInitializer
	// 				imageUrl={imageUrl}
	// 				imageWidth={imageDimensions.width}
	// 				heightCallback={(height) => {
	// 					setImageDimensions({
	// 						width: imageDimensions.width,
	// 						height: factorFloor(height, ROUND_FACTOR * pieces.rows)
	// 					});
	// 				}}
	// 			/>
	// 		);
	// 	}

	// 	function changeImage() {
	// 		const url = prompt("הכנס כתובת URL של תמונה");
	// 		setImageUrl(url);
	// 	}

	// 	function startGame() {
	// 		setGameStarted(true);
	// 	}

	// 	function makePieces() {
	// 		const array = [];
	// 		for (let row = 0; row < pieces.rows; row++) {
	// 			for (let col = 0; col < pieces.cols; col++) {
	// 				array.push(
	// 					<ImagePiece
	// 						containerRect={puzzleFrameRect}
	// 						width={imageDimensions.width / pieces.cols}
	// 						height={imageDimensions.height / pieces.rows}
	// 						row={row}
	// 						col={col}
	// 						zIndexArray={props.zIndexArray}
	// 					/>
	// 				);
	// 			}
	// 		}
	// 		return array;
	// 	}

	function handleStartGame(settings) {
		setImageUrl(settings.imageUrl);
		setImageWidth(defaultSettings.imageWidth);
		setImageHeight(defaultSettings.imageWidth / settings.imageAspectRatio);
		setRows(settings.rows);
		setCols(settings.cols);
		setGameStarted(true);
	}

	return (
		<div
			id="app"
			style={{
				"--image": `url("${imageUrl}")`,
				"--width": `${imageWidth}px`,
				"--height": `${imageHeight}px`,
				"--rows": rows,
				"--cols": cols,
			}}
		>
			<SettingsPanel handleStartGame={handleStartGame} />
			{gameStarted ? (
				<GameBoard
					imageUrl={imageUrl}
					imageWidth={imageWidth}
					imageHeight={imageHeight}
					rows={rows}
					cols={cols}
					zIndexArray={[]}
				/>
			) : null}
		</div>
	);
}

export default App;