import './CurvedGrid.scss';
import { useState, useMemo } from 'react';
import {
    randomizedCurveDirectionsGrid,
    mapCurveDirectionsGridToSVGPathsGrid,
    combinedSVGPathFromPathsGrid
} from '../SVGPaths/SVGCurvePaths';

function CurvedGrid({
    imageWidth,
    imageHeight
}: {
    imageWidth: number,
    imageHeight: number
}) {
    const rows = 4,
        cols = 3,
        pieceWidth = imageWidth / cols,
        pieceHeight = imageHeight / rows,
        curveSize = Math.min(pieceWidth, pieceHeight) * 0.2;

    // useState is used here to avoid unwanted re-randomizing
    // (useMemo is not reliable enough to never recompute)
    // ToDo: Find a cleaner method
    const [directionsGrid] = useState(
        () => randomizedCurveDirectionsGrid(rows, cols));
    
    const pathsGrid = useMemo(() =>
        mapCurveDirectionsGridToSVGPathsGrid({
            directionsGrid,
            pieceWidth,
            pieceHeight,
            curveSize
        }),
    [
        directionsGrid,
        pieceWidth,
        pieceHeight,
        curveSize
    ]);

    const combinedPath = useMemo(() =>
        combinedSVGPathFromPathsGrid({
            grid: pathsGrid,
            pieceWidth,
            pieceHeight
        }
    ), [
        pathsGrid,
        pieceWidth,
        pieceHeight,
    ]);

    return <svg
        id="curved-grid"
        stroke="blue"
        strokeWidth="5"
        fill="none"
    >
        <path d={combinedPath} />
    </svg>
}

export default CurvedGrid;