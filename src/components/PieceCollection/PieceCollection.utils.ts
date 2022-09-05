import type { Position } from "../ImagePiece/ImagePiece";
import { isCloseTo } from '../../utils/utils';

interface PieceInfo {
    uniqueId: string,
    row: number,
    col: number,
    fractionalPosition: Position,
    correctPosition: Position,
    visible: boolean
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
                visible: false,
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

export type { PieceInfo };
export {
    fractionalToAbsolutePosition,
    absoluteToFractionalPosition,
    createPieceInfoArray,
    isPositionCorrect
};