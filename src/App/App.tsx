import './App.scss';
import { useState, useEffect, createContext, useContext } from 'react';
import GameBoard from '../GameBoard/GameBoard';

const
    windowDimensions = {
        width: window.innerWidth,
        height: window.innerHeight
    },
	initialGlobalState = {
		imageUrl:
			"https://upload.wikimedia.org/wikipedia/commons/5/53/Liocrno_%28opera_propria%29.jpg",
		// imageWidth: windowDimensions.width * 0.8,
		// imageHeight: windowDimensions.height * 0.9,
		// curveSize: 0,
		// imageAspectRatio : 1,
		rows: 3,
		cols: 2,
		// curvedPathsMatrixes: {
		// 	horizontal: [[]],
		// 	vertical: [[]]
		// },
	},
	GlobalState = createContext(initialGlobalState);

function listenToWindowResize(callback: () => void) {
	window.addEventListener('resize', callback);
}

function App() {

	function fetchWindowDimensions() {
		return {
			width: window.innerWidth,
			height: window.innerHeight
		}
	}

    const
		[imageUrl, setImageUrl] = useState(initialGlobalState.imageUrl),
		[windowDimensions, setWindowDimensions] = useState(
			fetchWindowDimensions),
		imageMaxWidth = windowDimensions.width * 0.8,
		imageMaxHeight = windowDimensions.height * 0.9,
		[imageAspectRatio, setImageAspectRatio] = useState(1),
		imageWidth = Math.min(
			imageMaxWidth, imageMaxHeight * imageAspectRatio
		);
	
	useEffect(() =>
		listenToWindowResize(() =>
			setWindowDimensions(fetchWindowDimensions))
	, []);

    return <GameBoard {...{
        imageUrl,
        imageWidth,
		setImageAspectRatio
    }}/>
}

export default App;