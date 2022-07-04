import './App.scss';
import { useState, useRef, createContext, useContext, useEffect, useMemo } from 'react';
import { ControlPanel } from './ControlPanel';
import { setDropZone } from './DropFiles';
import { ImagePiece } from './ImagePiece';
import { debugLog } from './DebugTools'
import {
		// ORIENTATION,
		// CURVE_DIRECTIONS,
		// curvePath,
		// edgePath,
		edgePaths, 
		randomizedCurvedPathGrid,
		piecePath,
		curvedGridCombinedPath,
		// dataUrlShapeFromPath,
		SVGFromPath
	} from './puzzleCurvePaths';

const
	initialGlobalState = {
		imageUrl:
			"https://upload.wikimedia.org/wikipedia/commons/5/53/Liocrno_%28opera_propria%29.jpg",
		imageWidth: null,
		imageHeight: null,
		curveSize: null,
		imageAspectRatio : 1,
		rows: 3,
		cols: 2,
		zIndexArray: [],
		curvedPathsMatrixes: {
			horizontal: [],
			vertical: []
		},
	},
	GlobalState = createContext(initialGlobalState);

function MainImage({ setImageAspectRatio }) {
	const ref = useRef();

	useEffect(() => setDropZone(ref.current), []);

	return (
		<img
			id="main-image"
			ref={ref}
			src={useContext(GlobalState).imageUrl}
			alt=""
			onLoad={(e) => setImageAspectRatio(
					e.target.naturalWidth / e.target.naturalHeight
				)
			}
		/>
	);
}

function PieceCollection({ container, curvedPathGrid }) {

	const {
		imageWidth,
		imageHeight,
		rows,
		cols,
		curveSize,
		zIndexArray
	} = useContext(GlobalState);

	const pieceWidth = imageWidth / cols,
		pieceHeight = imageHeight / rows;

	return (<>
		{
			Array.from({length: rows}, (_, row) =>
				Array.from({length: cols}, (_, col) =>
					<ImagePiece
						width={pieceWidth}
						height={pieceHeight}
						key={`${row}/${col}`}
						row={row}
						col={col}
						curveSize={curveSize}
						path={piecePath({
							row,
							col,
							pathGrid: curvedPathGrid,
							curveSize,
							pieceWidth,
							pieceHeight
						})}
						container={container}
						zIndexArray={zIndexArray}
					/>
				) 
			)
		}
	</>);
}

function GameBoard({ setImageAspectRatio, gameStarted }) {
	debugLog("<GameBoard> is rendered");

	const ref = useRef(null),
		{
			imageWidth,
			imageHeight,
			rows,
			cols,
			// zIndexArray,
			// curvedPathsMatrixes,
			curveSize
		} =
			useContext(GlobalState),
		pieceWidth = imageWidth / cols,
		pieceHeight = imageHeight / rows;

	const curvedPathGrid = useMemo(() => {

			const {
				// horizontalPlain,
				// verticalPlain,
				curvedUp,
				curvedRight,
				curvedDown,
				curvedLeft
			} = edgePaths({ pieceWidth, pieceHeight, curveSize });

			return randomizedCurvedPathGrid({
				curvedUp,
				curvedRight,
				curvedDown,
				curvedLeft,
				cols,
				rows
			});
		},
			[pieceWidth, pieceHeight, rows, cols, curveSize]
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

	return (
		<div id="game-wrapper">
			<div id="puzzle-frame" ref={ref}>
				{ gameStarted ?
					<PieceCollection
						container={ref.current}
						curvedPathGrid={curvedPathGrid}
					/> :
					<MainImage
						{...{
							setImageAspectRatio
						}}
					/>
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
		[pieceWidth, pieceHeight] = [ imageWidth / cols, imageHeight / rows],
		curveSize = Math.min(pieceWidth, pieceHeight) * 0.25,
		[gameStarted, setGameStarted] = useState(false);
		
	return (
		<GlobalState.Provider value={{
			...globalState,
			...{
				imageUrl,
				imageAspectRatio,
				imageWidth,
				imageHeight,
				curveSize
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
					{...{
						rows,
						cols,
						setImageUrl,
						setRows,
						setCols
					}}
					startGameCallback={() => setGameStarted(true)}
				/>
				<GameBoard
					{...{
						imageUrl,
						setImageAspectRatio,
						gameStarted
					}}
				/>
			</div>
		</GlobalState.Provider>
	);
}

export default App;