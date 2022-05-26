import './App.scss';
import { useState, useEffect, useRef } from 'react';
import { defaultSettings, SettingsPanel } from './SettingsPanel.js';
import { ImagePiece } from './ImagePiece';

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
		setPuzzleFrameRect(ref.current.getBoundingClientRect());
	}, [puzzleFrameRect]);

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