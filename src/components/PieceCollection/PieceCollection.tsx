import { useContext, useEffect, useReducer } from "react";
import { GlobalState } from "../../GlobalState/GlobalState";
import ImagePiece, { Position } from "../ImagePiece/ImagePiece";
import { extractPieceOutlinePath, SVGPathsGrid } from '../../utils/SVGCurvePaths';
import { isCloseTo, useResetableState } from '../../utils/utils';

interface PieceInfo {
    uniqueId: string,
    row: number,
    col: number,
    fractionalPosition: Position,
    correctPosition: Position,
}

function calculatePieceCorrectPosition({
    row,
    col,
    rows,
    cols
}: {
    row: number,
    col: number,
    rows: number,
    cols: number
}): Position {
    return {
        x: col / cols,
        y: row / rows
    }
}

function fractionalToAbsolutePosition(
    fractionalPosition: Position,
    {
        imageWidth,
        imageHeight,
    }: {
        imageWidth: number,
        imageHeight: number,
    }
): Position {
    return {
        x: imageWidth * fractionalPosition.x,
        y: imageHeight * fractionalPosition.y
    }
}

function absoluteToFractionalPosition(
    absolutePosition: Position,
    {
        imageWidth,
        imageHeight,
    }: {
        imageWidth: number,
        imageHeight: number,
    }
): Position {
    return {
        x: absolutePosition.x / imageWidth,
        y: absolutePosition.y / imageHeight
    }
}

function createPieceInfoArray({
    rows,
    cols,
}: {
    rows: number,
    cols: number,
}): PieceInfo[] {
    const array: PieceInfo[] = [];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const uniqueId = `${row}/${col}`;

            array.push({
                uniqueId,
                row,
                col,
                // ToDo: randomize initial position
                fractionalPosition: {
                    x: -col / cols,
                    y: row / rows
                },
                correctPosition: calculatePieceCorrectPosition({
                    row,
                    col,
                    rows,
                    cols,
                }),
            })
        }
    }

    return array;
}

function isPositionCorrect(
    {
        fractionalPosition,
        correctPosition
    }: PieceInfo
): boolean {
    return isCloseTo(fractionalPosition.x, correctPosition.x) &&
        isCloseTo(fractionalPosition.y, correctPosition.y);
}

function PieceCollection({
    svgPathsGrid,
    imageCompletedCallback,
    isRestarting,
}: {
    svgPathsGrid: SVGPathsGrid,
    imageCompletedCallback: () => void,
    isRestarting: boolean,
}) {
    const {
        imageWidth,
        imageHeight,
        pieceWidth,
        pieceHeight,
        curveSize,
        rows,
        cols
    } = useContext(GlobalState);

    const [pieceInfoArray, setPieceInfoArray] = useResetableState(() =>
            createPieceInfoArray({
                rows,
                cols,
            }),
            isRestarting
        );
    
    function updatePiecePosition(uniqueId: string, newAbsolutePosition: Position) {
        const newArray = [...pieceInfoArray];        
        const piece = newArray.find(value => value.uniqueId === uniqueId);
        if (!piece) {
            console.warn('Unexpected uniqueId');
            return;
        }
        piece.fractionalPosition = absoluteToFractionalPosition(
            newAbsolutePosition,
            {
                imageWidth,
                imageHeight
            }
        );

        setPieceInfoArray(newArray);
    }

    function putPieceOnTopLogic(oldZIndexSorter: string[], pieceKey: string): string[] {
        const newZIndexSorter = Array.from(oldZIndexSorter);
        const index = newZIndexSorter.indexOf(pieceKey);

        if (index !== -1) {
            newZIndexSorter.splice(index, 1);
        }
        newZIndexSorter.push(pieceKey);

        return newZIndexSorter;
    }

    const [zIndexSorter, putPieceOnTop] = useReducer(putPieceOnTopLogic, []);

    const [isImageCompleted, setIsImageCompleted] =
        useResetableState(false, isRestarting);
    if (!isImageCompleted && pieceInfoArray.every(isPositionCorrect)) {
        setIsImageCompleted(true);
    }

    useEffect(() => {
        if (isImageCompleted) {
            imageCompletedCallback();
        }
    }, [isImageCompleted]);

    return <>
        {pieceInfoArray.map(pieceInfo => {
            const { uniqueId, row, col, fractionalPosition } = pieceInfo;

            return <ImagePiece
                {...{
                    uniqueId,
                    key: uniqueId,
                    imageOffset: {
                        x: pieceWidth * col - curveSize,
                        y: pieceHeight * row - curveSize
                    },
                    shapePath: extractPieceOutlinePath({
                        grid: svgPathsGrid,
                        row,
                        col,
                        pieceWidth,
                        pieceHeight,
                        curveSize
                    }),
                    row,
                    col,
                    position: fractionalToAbsolutePosition(
                        fractionalPosition,
                        {
                            imageWidth,
                            imageHeight
                        }
                    ),
                    isImageCompleted,
                }}
                updatePosition={(newAbsolutePosition: Position) =>
                    updatePiecePosition(uniqueId, newAbsolutePosition)}
                zIndex={
                    (n => n === -1 ? null : n + 1)
                        (zIndexSorter.indexOf(uniqueId))
                }
                putOnTop={() => putPieceOnTop(uniqueId)}
            />
        })}
    </>
}

export default PieceCollection;

export const exportedForTesting = {
    createPieceInfoArray
};