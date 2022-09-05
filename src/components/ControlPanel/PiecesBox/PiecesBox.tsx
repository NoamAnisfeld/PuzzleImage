import type { Position } from '../../ImagePiece/ImagePiece';

function PiecesBox({
    pickPiece
}: {
    pickPiece: (position: Position) => void
}) {
    return <svg
        id="pieces-box"
        width="100"
        height="50"
        onClick={e => {
            const {x, y}: Position = 
                e.currentTarget.getBoundingClientRect();
            pickPiece({x, y});
        }}
    >
        <rect
            width="100"
            height="50"
        />
    </svg>
}

export default PiecesBox;