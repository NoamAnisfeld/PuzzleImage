import { useContext, useReducer } from "react";
import { GlobalState } from "../GlobalState/GlobalState";
import ImagePiece from "../ImagePiece/ImagePiece";
import { extractPieceOutlinePath, SVGPathsGrid } from '../SVGPaths/SVGCurvePaths';

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