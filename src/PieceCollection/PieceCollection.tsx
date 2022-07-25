import { useReducer } from "react";
import ImagePiece from "../ImagePiece/ImagePiece";
import { extractPieceOutlinePath, SVGPathsGrid } from '../SVGPaths/SVGCurvePaths';

function PieceCollection({
    imageUrl,
    imageWidth,
    imageHeight,
    pieceWidth,
    pieceHeight,
    curveSize,
    svgPathsGrid,
    rows,
    cols
}: {
    imageUrl: string,
    imageWidth: number,
    imageHeight: number,
    pieceWidth: number,
    pieceHeight: number,
    curveSize: number,
    svgPathsGrid: SVGPathsGrid,
    rows: number,
    cols: number
}) {
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
                        imageUrl,
                        imageWidth,
                        imageHeight,
                        pieceWidth,
                        pieceHeight,
                        curveSize,
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