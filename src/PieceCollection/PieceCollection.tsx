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
    return <>
        {Array.from({ length: rows }, (_, row) =>
            Array.from({ length: cols}, (_, col) =>
                <ImagePiece 
                    key="{row}/{col}"            
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
                />
            )
        ).flat()}
    </>
}

export default PieceCollection;