import './DrawCurvedGrid.scss';
import { useContext, useMemo } from 'react';
import {
    SVGPathsGrid,
    combinedSVGPathFromPathsGrid,
} from '../../utils/SVGCurvePaths';
import { GlobalState } from '../../GlobalState/GlobalState';

function DrawCurvedGrid({
    svgPathsGrid,    
}: {
    svgPathsGrid: SVGPathsGrid,    
}) {
    const {
        pieceWidth,
        pieceHeight
    } = useContext(GlobalState);

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