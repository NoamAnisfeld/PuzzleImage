import './App.scss';
import { useState, useRef, createContext, useContext, useEffect, useMemo } from 'react';
import { ControlPanel } from './ControlPanel';
import { setDropZone } from './DropFiles';
import { ImagePiece } from './ImagePiece';
import { debugLog } from './DebugTools'
import {
		ORIENTATION,
		CURVE_DIRECTIONS,
		curvePath,
		edgePath,
		edgePaths, 
		randomizedCurvedPathGrid,
		curvedGridCombinedPath,
		dataUrlShapeFromPath,
		SVGFromPath
	} from './puzzleCurvePaths';

const
	initialGlobalState = {
		imageUrl:
			"https://upload.wikimedia.org/wikipedia/commons/5/53/Liocrno_%28opera_propria%29.jpg",
		imageWidth: null,
		imageHeight: null,
		imageAspectRatio : 1,
		setImageAspectRatio: null,
		rows: 3,
		cols: 2,
		zIndexArray: [],
		curvedPathsMatrixes: {
			horizontal: [],
			vertical: []
		}
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

function GameBoard({ /* imageWidth, imageHeight, rows, cols, */ gameStarted }) {
	debugLog("<GameBoard> is rendered");

	const ref = useRef(null),
		{ imageWidth, imageHeight, rows, cols, zIndexArray, curvedPathsMatrixes } =
			useContext(GlobalState),
		pieceWidth = imageWidth / cols,
		pieceHeight = imageHeight / rows;

	const curvedPathGrid = useMemo(() => {

			const {
				horizontalPlain,
				verticalPlain,
				curvedUp,
				curvedRight,
				curvedDown,
				curvedLeft
			} = edgePaths({ pieceWidth, pieceHeight });

			return randomizedCurvedPathGrid({
				curvedUp,
				curvedRight,
				curvedDown,
				curvedLeft,
				cols,
				rows
			});
			
			// curveSize = Math.min(pieceWidth, pieceHeight) * 0.5,
			// 	horizontalPlain = edgePath(
			// 		ORIENTATION.HORIZONTAL,
			// 		pieceWidth,
			// 		CURVE_DIRECTIONS.NONE
			// 	),
			// 	verticalPlain = edgePath(
			// 		ORIENTATION.VERTICAL,
			// 		pieceHeight,
			// 		CURVE_DIRECTIONS.NONE
			// 	),
			// 	curvedUp = edgePath(
			// 		ORIENTATION.HORIZONTAL,
			// 		pieceWidth,
			// 		CURVE_DIRECTIONS.UP,
			// 		curveSize
			// 	),
			// 	curvedDown = edgePath(
			// 		ORIENTATION.HORIZONTAL,
			// 		pieceWidth,
			// 		CURVE_DIRECTIONS.DOWN,
			// 		curveSize
			// 	),
			// 	curvedRight = edgePath(
			// 		ORIENTATION.VERTICAL,
			// 		pieceHeight,
			// 		CURVE_DIRECTIONS.RIGHT,
			// 		curveSize
			// 	),
			// 	curvedLeft = edgePath(
			// 		ORIENTATION.VERTICAL,
			// 		pieceHeight,
			// 		CURVE_DIRECTIONS.LEFT,
			// 		curveSize
			// 	);

			// const horizontalPaths = [];
			// for (let col = 0; col < cols; col++) {
			// 	// const x = col * pieceWidth;
			// 	const columnEdges = [/*  horizontalPlain  */];
			// 	// let y = pieceHeight;
			// 	for (let row = 0; row < rows - 1; row++) {
			// 		columnEdges.push(
			// 			Math.random() < 0.5 ?
			// 			curvedUp : curvedDown
			// 		)
			// 		// y += pieceHeight;
			// 	}
			// 	// columnEdges.push(horizontalPlain);

			// 	horizontalPaths.push(columnEdges);
			// }

			// const verticalPaths = [];
			// for (let row = 0; row < rows; row++) {
			// 	// const y = row * pieceHeight;
			// 	const rowEdges = [/*  verticalPlain  */];
			// 	// let x = pieceWidth;
			// 	for (let col = 0; col < cols - 1; col++) {
			// 		rowEdges.push(
			// 			Math.random() < 0.5 ?
			// 			curvedRight : curvedLeft
			// 		);
			// 		// x += pieceWidth;
			// 	}
			// 	// rowEdges.push(verticalPlain);

			// 	verticalPaths.push(rowEdges);
			// }

			// return {
			// 	horizontal: horizontalPaths,
			// 	vertical: verticalPaths
			// }
		},
			[pieceWidth, pieceHeight, rows, cols]
		// ),
		// curvedGridDataUrl = useMemo(() => {
		// 	const path = curvedGridPaths.horizontal.flat().join('') +
		// 		curvedGridPaths.vertical.flat().join('');
			
		// 	return dataUrlShapeFromPath(path);
		// },
		// 	[pieceWidth, pieceHeight, rows, cols]
		);

	const combinedPath = useMemo(() =>
		curvedGridCombinedPath({
			horizontalPaths: curvedPathGrid.horizontal,
			verticalPaths: curvedPathGrid.vertical,
			pieceWidth,
			pieceHeight
		}),
			[curvedPathGrid, pieceWidth, pieceHeight]
		);

	function makePieces(container) {
		const array = [];
		for (let row = 1; row <= rows; row++) {
			for (let col = 1; col <= cols; col++) {
				array.push(
					<ImagePiece
						width={pieceWidth}
						height={pieceHeight}
						key={`${row}/${col}`}
						row={row}
						col={col}
						plainEdges = {{
							top: row === 1,
							left: col === 1,
							bottom: row === rows,
							right: col === cols,
						}}
						container={container}
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
				<SVGFromPath
					className='curves-SVG'
					style={{
						position: 'absolute',
						top: '0',
						left: '0',
						width: '100%',
						height: '100%'
					}}
					fill="none" stroke="#fff" strokeWidth="5"
					path={combinedPath}
				/>
					{/* {[
						...curvedGridPaths.horizontal,
						...curvedGridPaths.vertical
					].flat().map(path =>
						<path d={path} />
					)}
					{[
						...(curvedGridPaths.horizontal.map((col, colIndex) =>
							col.map((path, rowIndex) =>
								<path
									d={`M${colIndex * pieceWidth},${rowIndex * pieceHeight}${path}`}
								/>
							)
						).flat()),
						...(curvedGridPaths.vertical.map((row, rowIndex) =>
							row.map((path, colIndex) =>
								<path
									d={`M${colIndex * pieceWidth},${rowIndex * pieceHeight}${path}`}
								/>
							)
						).flat()),
					]}
				</SVGFromPath> */}
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
			const maxWidth = window.innerWidth * 0.9,
				maxHeight = window.innerHeight * 0.9,
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
				// ToDo: Perhaps take out of global state
				setImageAspectRatio,
				imageWidth,
				imageHeight
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
					// imageWidth={imageWidth}
					// imageHeight={imageHeight}
					// rows={rows}
					// cols={cols}
					gameStarted={gameStarted}
				/>
			</div>
		</GlobalState.Provider>
	);
}

export default App;