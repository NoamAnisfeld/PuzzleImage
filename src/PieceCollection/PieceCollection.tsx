import { useContext, useState, useReducer } from "react";
import { GlobalState } from "../GlobalState/GlobalState";
import ImagePiece, { Position } from "../ImagePiece/ImagePiece";
import { extractPieceOutlinePath, SVGPathsGrid } from '../SVGPaths/SVGCurvePaths';

interface PieceInfo {
    row: number,
    col: number,
    correctPosition: Position,
    position: Position,
}

interface PieceMapping {
    [key: string]: PieceInfo
}

function createPieceMapping({
    rows,
    cols,
    pieceWidth,
    pieceHeight,
}: {
    rows: number,
    cols: number,
    pieceWidth: number,
    pieceHeight: number,
}): PieceMapping {
    const mapping: PieceMapping = {};

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const key = `${row}/${col}`;

            mapping[key] = {
                row,
                col,
                correctPosition: {
                    x: col * pieceWidth,
                    y: row * pieceHeight
                },
                // ToDo: randomize initial position
                position: {
                    x: -(col * pieceWidth),
                    y: row * pieceHeight
                }
            }
        }
    }

    return mapping;
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

    const [pieceMapping, setPieceMapping] = useState(createPieceMapping({
        rows,
        cols,
        pieceWidth,
        pieceHeight
    }));

    function updatePiecePosition(pieceKey: string, newPosition: Position) {
        if (!pieceMapping.hasOwnProperty(pieceKey)) {
            throw Error("invalid piece key");
        }

        setPieceMapping(oldPieceMapping => ({
            ...oldPieceMapping,
            [pieceKey]: {
                ...oldPieceMapping[pieceKey],
                position: newPosition
            }
        }));
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

    if (Object.keys(pieceMapping).every(key => {
        const { position, correctPosition } = pieceMapping[key];

        return position.x === correctPosition.x && position.y === correctPosition.y;
    })) {
        imageCompleted();
    }

    return <>
        {Object.keys(pieceMapping).map(key => {
            const { row, col, position } = pieceMapping[key];

            return <ImagePiece
                {...{
                    key,
                    uniqueId: key,
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
                updatePosition={(newPosition: Position) => updatePiecePosition(key, newPosition)}
                zIndex={
                    (n => n === -1 ? null : n + 1)
                        (zIndexSorter.indexOf(key))
                }
                putOnTop={() => putPieceOnTop(key)}
            />
        })}
    </>
}

export default PieceCollection;

export const exportedForTesting = {
    createPieceMapping
};