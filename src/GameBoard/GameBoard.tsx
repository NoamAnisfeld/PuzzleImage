import React, { useState, useMemo, useContext, CSSProperties } from "react";
import './GameBoard.scss';
import { GlobalState } from "../GlobalState/GlobalState";
import { mapCurveDirectionsGridToSVGPathsGrid, randomizedCurveDirectionsGrid } from "../SVGPaths/SVGCurvePaths";
import MainImage from "../MainImage/MainImage";
import PieceCollection from "../PieceCollection/PieceCollection";
import { allowCSSCustomProperties } from "../utils";

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
            ]);
    
    const
        COMPLETION_EFFECT_TIME = 5000,
        [isImageCompleted, setIsImageCompleted] = useState(false),
        [
            isImageCompletedAndEffectEnded,
            setIsImageCompletedAndEffectEnded
        ] = useState(false);

    function handleImageCompleted() {
        setIsImageCompleted(true);
        setTimeout(
            () => setIsImageCompletedAndEffectEnded(true),
            COMPLETION_EFFECT_TIME
        );
    }

    return <div
            id="game-wrapper"
            className={
                isImageCompleted && !isImageCompletedAndEffectEnded ?
                    'completion-effect' : undefined
            }
            style={allowCSSCustomProperties({
                '--completion-effect-time': `${COMPLETION_EFFECT_TIME}ms`,
            })}
        >
            <MainImage {...{
                isImageCompleted,
                setImageAspectRatio
            }} />
            {imageLoaded &&
            !isImageCompletedAndEffectEnded &&
            <PieceCollection {...{
                    svgPathsGrid,
                }}
                imageCompleted={handleImageCompleted}
            />}
        </div>
}

export default GameBoard;