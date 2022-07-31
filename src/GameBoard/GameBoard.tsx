import React, { useState, useMemo, useContext } from "react";
import './GameBoard.scss';
import { GlobalState } from "../GlobalState/GlobalState";
import { mapCurveDirectionsGridToSVGPathsGrid, randomizedCurveDirectionsGrid } from "../SVGPaths/SVGCurvePaths";
import MainImage from "../MainImage/MainImage";
import PieceCollection from "../PieceCollection/PieceCollection";

function GameBoard({
    setImageAspectRatio
}: {
    setImageAspectRatio: (n: number) => void
}) {
    const {
        imageLoaded,
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
        >
            <MainImage {...{
                isImageCompleted,
                setImageAspectRatio
            }} />
            {imageLoaded && !isImageCompleted && <PieceCollection {...{
                    svgPathsGrid,
                }}
                imageCompleted={() => setIsImageCompleted(true)}
            />}
        </div>
}

export default GameBoard;