import React, { useState, useMemo, useContext } from "react";
import './GameBoard.scss';
import { GlobalState } from "../GlobalState/GlobalState";
import { mapCurveDirectionsGridToSVGPathsGrid, randomizedCurveDirectionsGrid } from "../SVGPaths/SVGCurvePaths";
import MainImage from "../MainImage/MainImage";
import DrawCurvedGrid from "../CurvedGrid/CurvedGrid";
import PieceCollection from "../PieceCollection/PieceCollection";

function GameBoard({
    setImageAspectRatio
}: {
    setImageAspectRatio: (n: number) => void
}) {
    const {
        imageLoaded,
        imageUrl,
        imageWidth,
        imageHeight,
        rows,
        cols,
        pieceWidth,
        pieceHeight,
        curveSize,
    } = useContext(GlobalState);

    const
        [directionsGrid, setDirectionsGrid] =
            useState(() => randomizedCurveDirectionsGrid(rows, cols)),
        svgPathsGrid =
            useMemo(() => imageLoaded && mapCurveDirectionsGridToSVGPathsGrid({
                directionsGrid,
                pieceWidth,
                pieceHeight,
                curveSize
            }), [
                imageLoaded,
                directionsGrid,
                pieceWidth,
                pieceHeight,
                curveSize
            ]),
        [isImageCompleted, setIsImageCompleted] = useState(false);

    return <div
            id="game-wrapper"
            style={
                {
                    '--imageWidth': `${imageWidth}px`
                } as React.CSSProperties & {'--imageWidth': string}
            }
        >
            <MainImage {...{
                isImageCompleted,
                setImageAspectRatio
            }} />
            {/* {imageLoaded && <DrawCurvedGrid {...{
                svgPathsGrid,
            }}/>} */}
            {imageLoaded && !isImageCompleted && <PieceCollection {...{
                    svgPathsGrid,
                }}
                imageCompleted={() => setIsImageCompleted(true)}
            />}
        </div>
}

export default GameBoard;