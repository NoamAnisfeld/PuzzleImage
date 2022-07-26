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
        // imageAspectRatio,
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
            }), [ // dependencies
                imageLoaded,
                directionsGrid,
                pieceWidth,
                pieceHeight,
                curveSize
            ]);

    return <div
            id="game-wrapper"
            style={
                {
                    '--imageWidth': `${imageWidth}px`
                } as React.CSSProperties & {'--imageWidth': string}
            }
        >
            <MainImage {...{
                // imageUrl,
                setImageAspectRatio
            }} />
            {imageLoaded && <DrawCurvedGrid {...{
                svgPathsGrid,
                // pieceWidth,
                // pieceHeight
            }}/>}
            {imageLoaded && <PieceCollection {...{
                // imageUrl,
                // imageWidth,
                // imageHeight,
                // pieceWidth,
                // pieceHeight,
                // curveSize,
                svgPathsGrid,
                // rows,
                // cols
            }}/>}
        </div>
}

export default GameBoard;