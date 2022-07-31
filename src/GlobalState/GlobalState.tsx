import { createContext } from "react";

function fetchWindowDimensions() {
	return {
		width: window.innerWidth,
		height: window.innerHeight
	}
}

function listenToWindowResize(callback: () => void) {
	window.addEventListener('resize', callback);
}

const DEVELOPMENT_MODE_STORAGE_KEY = 'development-mode';

const initialGlobalState = {
    developmentMode:
        localStorage.getItem(DEVELOPMENT_MODE_STORAGE_KEY) === 'true',
    imageLoaded: false,
	imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/5/53/Liocrno_%28opera_propria%29.jpg",
	rows: 4,
	cols: 3,
}

type GlobalStateInterface = typeof initialGlobalState & Partial<{
	windowDimensions: {
		width: number,
		height: number
	}
	imageAspectRatio: number,
	imageWidth: number,
	imageHeight: number,
    pieceWidth: number,
    pieceHeight: number,
	curveSize: number,
}>

window.addEventListener('keyup', event => {
    if (event.code === 'KeyD' && event.ctrlKey && event.altKey) {
        localStorage.setItem(DEVELOPMENT_MODE_STORAGE_KEY,
            localStorage.getItem(DEVELOPMENT_MODE_STORAGE_KEY) === 'true' ? 'false' : 'true');
    }
})

function globalStateDoCalculations(oldState: GlobalStateInterface): GlobalStateInterface {
    const { imageAspectRatio, rows, cols } = oldState;

    if (!imageAspectRatio) { // no basis for calculations
        return {...oldState};
    }

    const
        windowDimensions = fetchWindowDimensions(),
        imageMaxWidth = windowDimensions.width * 0.8,
        imageMaxHeight = windowDimensions.height * 0.9,
        imageWidth = Math.min(
            imageMaxWidth, imageMaxHeight * imageAspectRatio
        ),
        imageHeight = imageWidth / imageAspectRatio,
        pieceWidth = imageWidth / cols,
        pieceHeight = imageHeight / rows,
        curveSize = Math.min(pieceWidth, pieceHeight) * 0.2;

    return {
        developmentMode: oldState.developmentMode,
        imageLoaded: true,
        imageUrl: oldState.imageUrl,
        rows,
        cols,
        windowDimensions,
        imageAspectRatio,
        imageWidth,
        imageHeight,
        pieceWidth,
        pieceHeight,
        curveSize,
    };
}

const GlobalState: React.Context<GlobalStateInterface> =
    createContext(globalStateDoCalculations(initialGlobalState));

export {
    GlobalStateInterface,
    GlobalState,
    globalStateDoCalculations,
    listenToWindowResize
};