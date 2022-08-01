import { useContext, useState, useReducer } from "react";
import { GlobalState } from "../GlobalState/GlobalState";
import ImagePiece, { Position } from "../ImagePiece/ImagePiece";
import { extractPieceOutlinePath, SVGPathsGrid } from '../SVGPaths/SVGCurvePaths';

interface PieceInfo {
    uniqueId: string,
    row: number,
    col: number,
    correctPosition: Position,
    position: Position,
}

function calculatePieceCorrectPosition({
    row,
    col,
    pieceWidth,
    pieceHeight
}: {
    row: number,
    col: number,
    pieceWidth: number,
    pieceHeight: number
}): Position {
    return {
        x: col * pieceWidth,
        y: row * pieceHeight
    }
}

function createPieceInfoArray({
    rows,
    cols,
    pieceWidth,
    pieceHeight,
}: {
    rows: number,
    cols: number,
    pieceWidth: number,
    pieceHeight: number,
}): PieceInfo[] {
    const array: PieceInfo[] = [];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const uniqueId = `${row}/${col}`;

            array.push({
                uniqueId,
                row,
                col,
                correctPosition: calculatePieceCorrectPosition({
                    row,
                    col,
                    pieceWidth,
                    pieceHeight
                }),
                // ToDo: randomize initial position
                position: {
                    x: -(col * pieceWidth),
                    y: row * pieceHeight
                }
            })
        }
    }

    return array;
}

function PieceCollection({
    svgPathsGrid,
    imageCompleted,
}: {
    svgPathsGrid: SVGPathsGrid,
    imageCompleted: () => void,
}) {
    const {
        pieceWidth,
        pieceHeight,
        curveSize,
        rows,
        cols
    } = useContext(GlobalState);

    const [pieceInfoArray, setPieceInfoArray] = useState(() =>
            createPieceInfoArray({
                rows,
                cols,
                pieceWidth,
                pieceHeight
            })
        );

    function updatePiecePosition(uniqueId: string, newPosition: Position) {
        const newArray = [...pieceInfoArray];        
        const piece = newArray.find(value => value.uniqueId === uniqueId);
        if (!piece) {
            console.warn('Unexpected uniqueId');
            return;
        }
        piece.position = newPosition;

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

    if (pieceInfoArray.every(value => {
        const { position, correctPosition } = value;

        return position.x === correctPosition.x && position.y === correctPosition.y;
    })) {
        imageCompleted();
    }

    return <>
        {pieceInfoArray.map(pieceInfo => {
            const { uniqueId, row, col, position } = pieceInfo;

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
                    position
                }}
                updatePosition={(newPosition: Position) =>
                    updatePiecePosition(uniqueId, newPosition)}
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