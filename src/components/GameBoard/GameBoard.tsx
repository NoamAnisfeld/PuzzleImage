import { useState, useMemo, useContext } from "react";
import './GameBoard.scss';
import { GlobalState } from "../../GlobalState/GlobalState";
import MainImage from "../MainImage/MainImage";
import PieceCollection from "../PieceCollection/PieceCollection";
import {
    mapCurveDirectionsGridToSVGPathsGrid,
    randomizedCurveDirectionsGrid
} from "../../utils/SVGCurvePaths";
import {
    allowCSSCustomProperties,
    useResetable,
    useResetableState,
} from "../../utils/utils";

function useGameInitialization(randomizeNewGrid: boolean) {
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

    const directionsGrid = useResetable(generateDirectionsGrid, randomizeNewGrid);

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
    setImageAspectRatio,
    isRestarting,
}: {
    setImageAspectRatio: (n: number) => void,
    isRestarting: boolean,
}) {
    const {
        imageLoaded,
    } = useContext(GlobalState);

    const {
        svgPathsGrid
    } = useGameInitialization(isRestarting);
    
    const
        COMPLETION_EFFECT_DURATION = 5000,
        [isImageCompleted, setIsImageCompleted] = useResetableState(false, isRestarting),
        [
            isImageCompletedAndEffectEnded,
            setIsImageCompletedAndEffectEnded
        ] = useResetableState(false, isRestarting);

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
                    isRestarting,
                }}
                imageCompleted={handleImageCompleted}
            />}
        </div>
}

export default GameBoard;