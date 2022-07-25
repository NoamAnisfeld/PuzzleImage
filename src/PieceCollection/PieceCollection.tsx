import ImagePiece from "../ImagePiece/ImagePiece";
import { extractPieceOutlinePath, SVGPathsGrid } from '../SVGPaths/SVGCurvePaths';

function PieceCollection({
    imageUrl,
    imageWidth,
    pieceWidth,
    pieceHeight,
    curveSize,
    svgPathsGrid,
    rows,
    cols
}: {
    imageUrl: string,
    imageWidth: number,
    pieceWidth: number,
    pieceHeight: number,
    curveSize: number,
    svgPathsGrid: SVGPathsGrid,
    rows: number,
    cols: number
}) {
    return <>
        {Array.from({ length: cols }, (_, col) =>
            Array.from({ length: rows}, (_, row) =>
                <ImagePiece 
                    key="{row}/{col}"            
                    {...{
                        imageUrl,
                        imageWidth,
                        imageOffset: {
                            x: pieceWidth * col,
                            y: pieceHeight * row
                        },
                        shapePath: extractPieceOutlinePath({
                            grid: svgPathsGrid,
                            row,
                            col,
                            pieceWidth,
                            pieceHeight,
                            curveSize
                        })
                    }}
                />
            )
        ).flat()}
    </>
}

export default PieceCollection;