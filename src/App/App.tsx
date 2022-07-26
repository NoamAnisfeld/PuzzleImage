import './App.scss';
import { useState, useReducer, useEffect, createContext, useContext } from 'react';
import { GlobalStateInterface, GlobalState, listenToWindowResize, globalStateDoCalculations } from '../GlobalState/GlobalState';
import GameBoard from '../GameBoard/GameBoard';

// const
    // windowDimensions = {
    //     width: window.innerWidth,
    //     height: window.innerHeight
    // },
	// initialGlobalState: GlobalStateInterface = {
	// 	imageUrl:
	// 		"https://upload.wikimedia.org/wikipedia/commons/5/53/Liocrno_%28opera_propria%29.jpg",
	// 	rows: 3,
	// 	cols: 2,
	// },
	// GlobalState = createContext(initialGlobalState);

// function fetchWindowDimensions() {
// 	return {
// 		width: window.innerWidth,
// 		height: window.innerHeight
// 	}
// }

// function listenToWindowResize(callback: () => void) {
// 	window.addEventListener('resize', callback);
// }

function App() {

	const [globalStateProvider, setGlobalStateProvider] =
		useReducer(
			function (
				oldState: GlobalStateInterface,
				newState: Partial<GlobalStateInterface>
			): GlobalStateInterface {
				return globalStateDoCalculations({...oldState, ...newState});
			},
			useContext(GlobalState)
		);

	function setImageUrl(url: string) {
		setGlobalStateProvider({ imageUrl: url });
	}

	function setImageAspectRatio(aspectRatio: number) {
		console.log('setImageAspectRatio: ', aspectRatio);
		setGlobalStateProvider({ imageAspectRatio: aspectRatio });
	}

	// const
	// 	[imageUrl, setImageUrl] = useState(initialGlobalState.imageUrl),
	// 	[windowDimensions, setWindowDimensions] = useState(
	// 		fetchWindowDimensions),
	// 	[imageAspectRatio, setImageAspectRatio] = useState(1);

	// const
	// 	imageMaxWidth = windowDimensions.width * 0.8,
	// 	imageMaxHeight = windowDimensions.height * 0.9,
	// 	imageWidth = Math.min(
	// 		imageMaxWidth, imageMaxHeight * imageAspectRatio
	// 	);

	// const { imageUrl, imageWidth } = globalStateProvider;
	
	useEffect(() =>
		listenToWindowResize(() => 
			setGlobalStateProvider(globalStateDoCalculations(globalStateProvider)))
	, []);

	// const { // deprecated
	// 	imageUrl,
	// 	imageWidth,
	// 	imageHeight
	// } = globalStateProvider;

    return <GlobalState.Provider value={{...globalStateProvider}}>
		<GameBoard
			{...{
			// 	imageUrl,
			// 	imageWidth,
			// 	imageHeight,
				setImageAspectRatio
			}}
		/>
	</GlobalState.Provider>
}

export default App;