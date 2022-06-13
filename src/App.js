import './App.scss';
import { useState, useEffect, useRef } from 'react';
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

function MainImage() {
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

	const
		// [puzzleFrameRect, setPuzzleFrameRect] = useState(),
		ref = useRef(null);

	// useEffect(() => {
	// 	setPuzzleFrameRect(ref.current.getBoundingClientRect());
	// }, []);

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
					<MainImage />
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
		[imageAspectRatio, setImageAspectRatio] = useState(1),
		imageHeight = imageWidth / imageAspectRatio,
		[rows, setRows] = useState(defaultSettings.rows),
		[cols, setCols] = useState(defaultSettings.cols),
		[gameStarted, setGameStarted] = useState(false);
		

	return (
		<GlobalSettings.Consumer>{(settings) =>
			<GlobalSettings.Provider value={{
				...settings,
				...{
					imageUrl,
					imageAspectRatio,
					setImageAspectRatio
				}
			}}>
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
					<SettingsPanel
						rows={rows}
						cols={cols}
						setImageUrl={setImageUrl}
						setRows={setRows}
						setCols={setCols}
						startGameCallback={() => setGameStarted(true)}
					/>
					<GameBoard
						imageUrl={imageUrl}
						imageWidth={imageWidth}
						imageHeight={imageHeight}
						rows={rows}
						cols={cols}
						zIndexArray={[]}
						gameStarted={gameStarted}
					/>
				</div>
			</GlobalSettings.Provider>
		}</GlobalSettings.Consumer>
	);
}

export default App;