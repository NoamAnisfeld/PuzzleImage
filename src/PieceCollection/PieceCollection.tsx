import { useContext, useReducer } from "react";
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
}: {
    svgPathsGrid: SVGPathsGrid,
}) {
    const {
        pieceWidth,
        pieceHeight,
        curveSize,
        rows,
        cols
    } = useContext(GlobalState);

    function putPieceOnTopLogic(oldZIndexArray: string[], pieceKey: string): string[] {
        const newZIndexArray = Array.from(oldZIndexArray);
        const index = newZIndexArray.indexOf(pieceKey);

        if (index !== -1) {
            newZIndexArray.splice(index, 1);
        }
        newZIndexArray.push(pieceKey);

        return newZIndexArray;
    }

    const [zIndexArray, putPieceOnTop] = useReducer(putPieceOnTopLogic, []);

    return <>
        {Array.from({ length: rows }, (_, row) =>
            Array.from({ length: cols }, (_, col) =>
                <ImagePiece
                    {...{
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
                        col
                    }}
                    key={`${row}/${col}`}
                    zIndex={
                        (n => n === -1 ? null : n + 1)
                            (zIndexArray.indexOf(`${row}/${col}`))
                    }
                    putOnTop={() => putPieceOnTop(`${row}/${col}`)}
                />
            )
        ).flat()}
    </>
}

export default PieceCollection;

export const exportedForTesting = {
    createPieceMapping
};