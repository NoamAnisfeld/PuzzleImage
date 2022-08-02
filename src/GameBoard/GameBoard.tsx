import React, { useState, useMemo, useContext } from "react";
import './GameBoard.scss';
import { GlobalState } from "../GlobalState/GlobalState";
import { mapCurveDirectionsGridToSVGPathsGrid, randomizedCurveDirectionsGrid } from "../SVGPaths/SVGCurvePaths";
import MainImage from "../MainImage/MainImage";
import PieceCollection from "../PieceCollection/PieceCollection";
import { allowCSSCustomProperties } from "../utils";

function useGameInitialization(reinitialize = false) {
    const {
        imageLoaded,
        rows,
        cols,
        pieceWidth,
        pieceHeight,
        curveSize,
    } = useContext(GlobalState);

    function generateDirectionsGrid() {
        return randomizedCurveDirectionsGrid(rows, cols)
    }

    const [directionsGrid, setDirectionsGrid] =
            useState(generateDirectionsGrid);

    if (reinitialize) {
        setDirectionsGrid(generateDirectionsGrid);
    }

    const svgPathsGrid =
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
            
        return {
            svgPathsGrid
        }
}

function GameBoard({
    setImageAspectRatio
}: {
    setImageAspectRatio: (n: number) => void
}) {
    const {
        imageLoaded,
    } = useContext(GlobalState);

    const {
        svgPathsGrid
    } = useGameInitialization();
    
    const
        COMPLETION_EFFECT_DURATION = 5000,
        [isImageCompleted, setIsImageCompleted] = useState(false),
        [
            isImageCompletedAndEffectEnded,
            setIsImageCompletedAndEffectEnded
        ] = useState(false);

    function handleImageCompleted() {
        setIsImageCompleted(true);
        setTimeout(
            () => setIsImageCompletedAndEffectEnded(true),
            COMPLETION_EFFECT_DURATION
        );
    }

    return <div
            id="game-wrapper"
            className={
                isImageCompleted && !isImageCompletedAndEffectEnded ?
                    'completion-effect' : undefined
            }
            style={allowCSSCustomProperties({
                '--completion-effect-duration': `${COMPLETION_EFFECT_DURATION}ms`,
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