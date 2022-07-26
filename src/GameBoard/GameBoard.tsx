import React, { useState, useMemo, useContext } from "react";
import './GameBoard.scss';
import { GlobalState } from "../GlobalState/GlobalState";
import { mapCurveDirectionsGridToSVGPathsGrid, randomizedCurveDirectionsGrid } from "../SVGPaths/SVGCurvePaths";
import MainImage from "../MainImage/MainImage";
import DrawCurvedGrid from "../CurvedGrid/CurvedGrid";
import PieceCollection from "../PieceCollection/PieceCollection";

function GameBoard({
    // imageUrl,
    // imageWidth,
    // imageHeight,
    // imageAspectRatio,
    setImageAspectRatio
}: {
    // imageUrl: string,
    // imageWidth: number,
    // imageHeight: number,
    // imageAspectRatio?: number,
    setImageAspectRatio: (n: number) => void
}) {
    const {
        imageUrl,
        imageWidth,
        imageHeight,
        imageAspectRatio,
        rows,
        cols,
        pieceWidth,
        pieceHeight,
        curveSize,
    } = useContext(GlobalState);

    // const rows = 4, // temporary value for development demo
    //     cols = 3,
    //     pieceWidth = imageWidth / cols,
    //     pieceHeight = imageHeight / rows,
    //     curveSize = Math.min(pieceWidth, pieceHeight) * 0.2;

    const
        [directionsGrid, setDirectionsGrid] =
            useState(() => randomizedCurveDirectionsGrid(rows, cols)),
        svgPathsGrid =
            useMemo(() => imageAspectRatio && mapCurveDirectionsGridToSVGPathsGrid({
                directionsGrid,
                pieceWidth,
                pieceHeight,
                curveSize
            }), [ // dependencies
                imageAspectRatio,
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
            {svgPathsGrid && [
                <DrawCurvedGrid {...{
                    svgPathsGrid,
                    pieceWidth,
                    pieceHeight
                }}/>,
                <PieceCollection {...{
                    imageUrl,
                    imageWidth,
                    imageHeight,
                    pieceWidth,
                    pieceHeight,
                    curveSize,
                    svgPathsGrid,
                    rows,
                    cols
                }}/>
            ]}
        </div>
}

export default GameBoard;