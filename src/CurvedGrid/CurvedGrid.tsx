import './CurvedGrid.scss';
import { singleCurvedLinePath } from './SVGCurvePaths';

function CurvedGrid({
    imageWidth,
    imageHeight
}: {
    imageWidth: number,
    imageHeight: number
}) {
    const rows = 2,
        cols = 2,
        pieceWidth = imageWidth / cols,
        pieceHeight = imageHeight / rows,
        curveSize = Math.min(pieceWidth, pieceHeight) * 0.2;

    return <svg
        id="curved-grid"
        stroke="blue"
        strokeWidth="5"
        fill="none"
    >
        <path d={`M0,${imageHeight / rows} ${singleCurvedLinePath({
            length: imageWidth / cols,
            curveSize, 
            curveDirection: 'up'
        })}`} />
        <path d={`M${imageWidth / cols},${imageHeight / rows} ${singleCurvedLinePath({
            length: imageWidth / cols,
            curveSize, 
            curveDirection: 'down'
        })}`} />
        <path d={`M${imageWidth / cols},0 ${singleCurvedLinePath({
            length: imageHeight / rows,
            curveSize, 
            curveDirection: 'right'
        })}`} />
        <path d={`M${imageWidth / cols},${imageHeight / rows} ${singleCurvedLinePath({
            length: imageHeight / rows,
            curveSize, 
            curveDirection: 'left'
        })}`} />
    </svg>
}

export default CurvedGrid;