import './CurvedGrid.scss';
import { useState, useMemo } from 'react';
import {
    SVGPathsGrid,
    combinedSVGPathFromPathsGrid,
} from '../SVGPaths/SVGCurvePaths';

function DrawCurvedGrid({
    svgPathsGrid,    
    pieceWidth,
    pieceHeight
}: {
    svgPathsGrid: SVGPathsGrid,    
    pieceWidth: number,
    pieceHeight: number
}) {
    const combinedPath = useMemo(() =>
        combinedSVGPathFromPathsGrid({
            grid: svgPathsGrid,
            pieceWidth,
            pieceHeight
        }
    ), [
        svgPathsGrid,
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

export default DrawCurvedGrid;