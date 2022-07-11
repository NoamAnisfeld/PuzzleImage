import './App.scss';
import { createContext, useContext } from 'react';
import GameBoard from './GameBoard';

const
    windowDimensions = {
        width: window.innerWidth,
        height: window.innerHeight
    },
	initialGlobalState = {
		imageUrl:
			"https://upload.wikimedia.org/wikipedia/commons/5/53/Liocrno_%28opera_propria%29.jpg",
		imageWidth: windowDimensions.width * 0.8,
		imageHeight: windowDimensions.height * 0.9,
		curveSize: 0,
		imageAspectRatio : 1,
		rows: 3,
		cols: 2,
		// curvedPathsMatrixes: {
		// 	horizontal: [[]],
		// 	vertical: [[]]
		// },
	},
	GlobalState = createContext(initialGlobalState);

function App() {
    const { imageUrl, imageWidth, imageHeight } =
        useContext(GlobalState);

    return <GameBoard {...{
        imageUrl,
        imageWidth,
        imageHeight
    }}/>
}

export default App;