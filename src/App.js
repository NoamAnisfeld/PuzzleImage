import './App.scss';
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { defaultSettings, GlobalSettings, SettingsPanel } from './SettingsPanel.js';
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

function Image() {
	return (
		<GlobalSettings.Consumer>
		{ settings =>
			<img
				src={settings.imageUrl}
				onLoad={(e) =>
					settings.setImageAspectRatio(
						e.target.naturalWidth / e.target.naturalHeight
					)
				}
			/>
		}
		</GlobalSettings.Consumer>
	);
}

function GameBoard({ imageWidth, imageHeight, rows, cols, zIndexArray, gameStarted }) {
	debugLog("<GameBoard> is rendered");

	const [puzzleFrameRect, setPuzzleFrameRect] = useState(),
		ref = useRef(null);

	useEffect(() => {
		setPuzzleFrameRect(ref.current.getBoundingClientRect());
	}, []);

	function makePieces(container) {
		const array = [];
		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < cols; col++) {
				array.push(
					<ImagePiece
						container={container}
						width={imageWidth / cols}
						height={imageHeight / rows}
						row={row}
						col={col}
						zIndexArray={zIndexArray}
					/>
				);
			}
		}
		return array;
	}

	return (
		<div id="game-wrapper">
			<div id="puzzle-frame" ref={ref}>
				{ gameStarted ?
					makePieces(ref.current) :
					<GlobalSettings.Consumer>
					{ ({imageUrl}) => <Image imageUrl={imageUrl} /> }
					</GlobalSettings.Consumer>
				}
			</div>
		</div>
	);
}

function App() {
	debugLog("<App> is rendered");

	const
		[imageUrl, setImageUrl] = useState(defaultSettings.imageUrl),
		[imageWidth, setImageWidth] = useState(defaultSettings.imageWidth),
		[imageHeight, setImageHeight] = useState(defaultSettings.imageWidth),
		[imageAspectRatio, setImageAspectRatio] = useState(1),
		[rows, setRows] = useState(defaultSettings.rows),
		[cols, setCols] = useState(defaultSettings.cols),
		[gameStarted, setGameStarted] = useState(false);

	function handleStartGame(settings) {
		// setImageUrl(settings.imageUrl);		
		// setImageWidth(defaultSettings.imageWidth);
		// setImageHeight(defaultSettings.imageWidth / imageAspectRatio);
		// setRows(settings.rows);
		// setCols(settings.cols);
		setGameStarted(true);
	}

	return (
		<GlobalSettings.Consumer>
		{(settings) => (
		<GlobalSettings.Provider value={{
			...settings,
			imageUrl: imageUrl,
			imageAspectRatio: imageAspectRatio,
			setImageAspectRatio: setImageAspectRatio
		}}>
			<div
				id="app"
				style={{
					"--image": `url("${imageUrl}")`,
					"--width": `${imageWidth}px`,
					"--height": `${imageWidth / imageAspectRatio}px`,
					"--rows": rows,
					"--cols": cols,
				}}
			>
				<SettingsPanel
					setImageUrl={setImageUrl}
					rows={rows}
					cols={cols}
					setRows={setRows}
					setCols={setCols}
					startGameCallback={handleStartGame}
				/>
				<GameBoard
					imageUrl={imageUrl}
					imageWidth={imageWidth}
					imageHeight={imageWidth / imageAspectRatio}
					rows={rows}
					cols={cols}
					zIndexArray={[]}
					gameStarted={gameStarted}
				/>
			</div>
		</GlobalSettings.Provider>)}
		</GlobalSettings.Consumer>
	);
}

export default App;