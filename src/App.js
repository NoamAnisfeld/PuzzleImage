import './App.scss';
import { useState, useRef, createContext, useContext, useEffect, useMemo } from 'react';
import { ControlPanel } from './ControlPanel';
import { setDropZone } from './DropFiles';
import { ImagePiece } from './ImagePiece';
import { debugLog } from './DebugTools'

const
	defaultSettings = {
		imageUrl:
			"https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/%D0%A0%D0%B0%D0%BD%D0%BE%D0%BA_%D0%BD%D0%B0_%D0%9C%D0%B0%D0%BD%D0%B3%D1%83%D0%BF%D1%96.jpg/750px-%D0%A0%D0%B0%D0%BD%D0%BE%D0%BA_%D0%BD%D0%B0_%D0%9C%D0%B0%D0%BD%D0%B3%D1%83%D0%F%D1%96.jpg",
		imageWidth: window.innerWidth * 0.8,
		rows: 3,
		cols: 2
	},
	GlobalSettings = createContext(defaultSettings);

function MainImage() {
	const settings = useContext(GlobalSettings),
		ref = useRef();

	useEffect(() => setDropZone(ref.current), []);

	return (
		<img
			id="main-image"
			ref={ref}
			src={settings.imageUrl}
			alt=""
			onLoad={(e) =>
				settings.setImageAspectRatio(
					e.target.naturalWidth / e.target.naturalHeight
				)
			}
		/>
	);
}

function GameBoard({ imageWidth, imageHeight, rows, cols, zIndexArray, gameStarted }) {
	debugLog("<GameBoard> is rendered");

	const ref = useRef(null);

	function makePieces(container) {
		const array = [];
		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < cols; col++) {
				array.push(
					<ImagePiece
						container={container}
						width={imageWidth / cols}
						height={imageHeight / rows}
						key={`${row/col}`}
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
		settings = useContext(GlobalSettings),
		[imageUrl, setImageUrl] = useState(settings.imageUrl),
		[imageAspectRatio, setImageAspectRatio] = useState(settings.imageAspectRatio),
		[imageWidth, imageHeight] = useMemo(() => {
			const maxWidth = window.innerWidth * 0.8,
				maxHeight = window.innerHeight * 0.7,
				adjustedHeight = maxWidth / imageAspectRatio;

			if (adjustedHeight <= maxHeight) {
				return [maxWidth, adjustedHeight];
			} else {
				return [maxHeight * imageAspectRatio, maxHeight]
			}
		}, [imageAspectRatio, window.innerWidth, window.innerHeight]),
		[rows, setRows] = useState(settings.rows),
		[cols, setCols] = useState(settings.cols),
		[gameStarted, setGameStarted] = useState(false);
		
	return (
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
				<ControlPanel
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
	);
}

export default App;