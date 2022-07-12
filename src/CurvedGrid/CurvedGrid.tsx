import './CurvedGrid.scss';

function CurvedGrid({
    imageWidth,
    imageHeight
}: {
    imageWidth: number,
    imageHeight: number
}) {

    const rows = 2,
        cols = 2;

    return <svg
        id="curved-grid"
        stroke="white"
        strokeWidth="5"
    >
        <path d={`M${imageWidth / cols},0 v${imageHeight} M0,${imageHeight / rows} h${imageWidth}`} />
    </svg>
}

export default CurvedGrid;