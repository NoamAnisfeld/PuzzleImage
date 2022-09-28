import { createContext } from "react";
import type { Orientation } from '../utils/utils';

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
        // "https://upload.wikimedia.org/wikipedia/commons/5/53/Liocrno_%28opera_propria%29.jpg",
        "PuzzleImage/Animated Minions.webp",
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
    roomInWindow: Orientation,
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

function imageDimensionsLogic({
    windowDimensions,
    imageAspectRatio
}: Pick<GlobalStateInterface,
    "windowDimensions" |
    "imageAspectRatio"
>): Pick<GlobalStateInterface,
    "imageWidth" |
    "imageHeight" |
    "roomInWindow"
> {
    const
        BORDER_WIDTH = 20,
        BORDERS_WIDTH = BORDER_WIDTH * 2,
        MIN_EXTRA_ROOM = 200;

    const
        maxImageWidth = windowDimensions.width - BORDERS_WIDTH,
        maxImageHeight = windowDimensions.height - BORDERS_WIDTH,
        preferredImageWidth = Math.min(
            maxImageWidth, maxImageHeight * imageAspectRatio
        ),
        preferredImageHeight = preferredImageWidth / imageAspectRatio,
        widthExtraRoom = windowDimensions.width - BORDERS_WIDTH -
            preferredImageWidth,
        heightExtraRoom = windowDimensions.height - BORDERS_WIDTH -
            preferredImageHeight;

    if (widthExtraRoom >= MIN_EXTRA_ROOM) {
        return {
            imageWidth: preferredImageWidth,
            imageHeight: preferredImageHeight,
            roomInWindow: "horizontal"
        }
    } else if (heightExtraRoom >= MIN_EXTRA_ROOM) {
        return {
            imageWidth: preferredImageWidth,
            imageHeight: preferredImageHeight,
            roomInWindow: "vertical"
        }
    } else if (widthExtraRoom >= heightExtraRoom) {
        const reducedImageWidth = windowDimensions.width - MIN_EXTRA_ROOM,
            reducedImageHeight = reducedImageWidth / imageAspectRatio;
        
        return {
            imageWidth: reducedImageWidth,
            imageHeight: reducedImageHeight,
            roomInWindow: "horizontal"
        }
    } else {
        const reducedImageHeight = windowDimensions.height - MIN_EXTRA_ROOM,
            reducedImageWidth = reducedImageHeight * imageAspectRatio;

        return {
            imageWidth: reducedImageWidth,
            imageHeight: reducedImageHeight,
            roomInWindow: "vertical"
        }
    }
}

function globalStateDoCalculations(oldState: GlobalStateInterface): GlobalStateInterface {
    const { imageAspectRatio, rows, cols } = oldState;

    if (!imageAspectRatio) { // no basis for calculations
        return {...oldState};
    }

    const
        windowDimensions = fetchWindowDimensions(),
        {
            imageWidth,
            imageHeight,
            roomInWindow
        } = imageDimensionsLogic({
            windowDimensions,
            imageAspectRatio
        }),
        pieceWidth = imageWidth / cols,
        pieceHeight = imageHeight / rows,
        curveSize = Math.min(pieceWidth, pieceHeight) * 0.2;

    return {
        ...oldState,
        imageLoaded: true,
        windowDimensions,
        imageWidth,
        imageHeight,
        roomInWindow,
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