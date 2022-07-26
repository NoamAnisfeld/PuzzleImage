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

const initialGlobalState = {
	imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/53/Liocrno_%28opera_propria%29.jpg",
	rows: 4,
	cols: 3,
    // imageAspectRatio: 1
}

type GlobalStateInterface = typeof initialGlobalState & Partial<{
	imageWidth: number,
	imageHeight: number,
	imageAspectRatio: number,
    pieceWidth: number,
    pieceHeight: number,
	curveSize: number,
	windowDimensions: {
		width: number,
		height: number
	}
}>

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
        imageUrl: oldState.imageUrl,
        imageWidth,
        imageHeight,
        imageAspectRatio,
        rows,
        cols,
        pieceWidth,
        pieceHeight,
        curveSize,
        windowDimensions,
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