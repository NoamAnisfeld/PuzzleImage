import React, { useState, useMemo } from "react";
import './GameBoard.scss';
import { mapCurveDirectionsGridToSVGPathsGrid, randomizedCurveDirectionsGrid } from "../SVGPaths/SVGCurvePaths";
import MainImage from "../MainImage/MainImage";
import DrawCurvedGrid from "../CurvedGrid/CurvedGrid";
import ImagePiece from "../ImagePiece/ImagePiece";

function GameBoard({
    imageUrl,
    imageWidth,
    imageHeight,
    setImageAspectRatio
}: {
    imageUrl: string,
    imageWidth: number,
    imageHeight: number,
    setImageAspectRatio: (n: number) => void
}) {
    const rows = 4, // temporary value for development demo
        cols = 3,
        pieceWidth = imageWidth / cols,
        pieceHeight = imageHeight / rows,
        curveSize = Math.min(pieceWidth, pieceHeight) * 0.2;

    const
        [directionsGrid, setDirectionsGrid] =
            useState(() => randomizedCurveDirectionsGrid(rows, cols)),
        svgPathsGrid =
            useMemo(() => mapCurveDirectionsGridToSVGPathsGrid({
                directionsGrid,
                pieceWidth,
                pieceHeight,
                curveSize
            }), [
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
                imageUrl,
                // imageWidth,
                setImageAspectRatio
            }} />
            <DrawCurvedGrid {...{
                svgPathsGrid,
                pieceWidth,
                pieceHeight
            }}/>
            <ImagePiece {...{
                imageUrl,
            }}/>
        </div>
}

export default GameBoard;