import './App.scss';
import { useState, useRef, createContext, useContext, useEffect, useMemo } from 'react';
import { ControlPanel } from './ControlPanel';
import { setDropZone } from './DropFiles';
import { ImagePiece } from './ImagePiece';
import { debugLog } from './DebugTools'

const
	initialGlobalState = {
		imageUrl:
			"https://upload.wikimedia.org/wikipedia/commons/5/53/Liocrno_%28opera_propria%29.jpg",
		imageWidth: window.innerWidth * 0.8,
		rows: 3,
		cols: 2,
		zIndexArray: []
	},
	GlobalState = createContext(initialGlobalState);

function MainImage() {
	const globalState = useContext(GlobalState),
		ref = useRef();

	useEffect(() => setDropZone(ref.current), []);

	return (
		<img
			id="main-image"
			ref={ref}
			src={globalState.imageUrl}
			alt=""
			onLoad={(e) =>
				globalState.setImageAspectRatio(
					e.target.naturalWidth / e.target.naturalHeight
				)
			}
		/>
	);
}

function GameBoard({ imageWidth, imageHeight, rows, cols, gameStarted }) {
	debugLog("<GameBoard> is rendered");

	const ref = useRef(null),
		zIndexArray = useContext(GlobalState).zIndexArray;

	function makePieces(container) {
		const array = [];
		for (let row = 1; row <= rows; row++) {
			for (let col = 1; col <= cols; col++) {
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
		globalState = useContext(GlobalState),
		[imageUrl, setImageUrl] = useState(globalState.imageUrl),
		[imageAspectRatio, setImageAspectRatio] = useState(globalState.imageAspectRatio),
		[imageWidth, imageHeight] = useMemo(() => {
			const maxWidth = window.innerWidth * 0.8,
				maxHeight = window.innerHeight * 0.7,
				adjustedHeight = maxWidth / imageAspectRatio;

			if (adjustedHeight <= maxHeight) {
				return [maxWidth, adjustedHeight];
			} else {
				return [maxHeight * imageAspectRatio, maxHeight]
			}
		}, [imageAspectRatio]),
		[rows, setRows] = useState(globalState.rows),
		[cols, setCols] = useState(globalState.cols),
		[gameStarted, setGameStarted] = useState(false);
		
	return (
		<GlobalState.Provider value={{
			...globalState,
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
					gameStarted={gameStarted}
				/>
			</div>
		</GlobalState.Provider>
	);
}

export default App;