import './ImagePiece.scss';
import { useContext, useState } from 'react';
import { GlobalState } from '../GlobalState/GlobalState';
import { SVGPath } from '../SVGPaths/SVGCurvePaths';

interface Position {
    x: number,
    y: number
}

function ImagePiece({
    uniqueId,
    imageOffset,
    shapePath,
    position,
    updatePosition,
    zIndex,
    putOnTop,
}: {
    uniqueId: string,
    imageOffset: {
        x: number,
        y: number
    }
    shapePath: SVGPath,
    position: Position,
    updatePosition: (newPosition: Position) => void,
    zIndex: number,
    putOnTop: () => void,
}) {
    const {
        imageUrl,
        imageWidth,
        imageHeight,
        pieceWidth,
        pieceHeight,
        curveSize,
    } = useContext(GlobalState);

    const [isDragged, setIsDragged] = useState(false),
        [positionDuringDrag, setPositionDuringDrag] = useState<Position>(),
        relevantPosition = isDragged ? positionDuringDrag : position;

    function normalizePosition({x, y}: Position) {
        const normalized: Position = {x, y};

        // don't normalize if it's out of the image border
        if (x < -(pieceWidth + 2 * curveSize) ||
            x > (imageWidth - curveSize) ||
            y < -(pieceHeight + 2 * curveSize) ||
            y > (imageHeight - curveSize)
        ) {
            return normalized;
        }

        const DISTANCE_FOR_NORMALIZATION = 20;

        const remainderX = Math.abs(x % pieceWidth),
            remainderY = Math.abs(y % pieceHeight);
        
        if (remainderX < DISTANCE_FOR_NORMALIZATION) {
            normalized.x -= remainderX;
        } else if (pieceWidth - remainderX < DISTANCE_FOR_NORMALIZATION) {
            normalized.x += pieceWidth - remainderX;
        }

        if (remainderY < DISTANCE_FOR_NORMALIZATION) {
            normalized.y -= remainderY;
        } else if (pieceHeight - remainderY < DISTANCE_FOR_NORMALIZATION) {
            normalized.y += pieceHeight - remainderY;
        }

        return normalized;
    }

    function startDrag(event: React.MouseEvent) {
        setIsDragged(true);
        setPositionDuringDrag(position);
        putOnTop();

        const originalRelativePosition = {
            x: position.x - event.pageX,
            y: position.y - event.pageY
        };

        function movePieceHandler(event: MouseEvent) {
            setPositionDuringDrag({
                x: originalRelativePosition.x + event.pageX,
                y: originalRelativePosition.y + event.pageY
            })
        }

        function endDrag(event: MouseEvent) {
            event.stopPropagation();
            setIsDragged(false);

            updatePosition(normalizePosition({
                x: originalRelativePosition.x + event.pageX,
                y: originalRelativePosition.y + event.pageY
            }));

            window.removeEventListener('mousemove', movePieceHandler);
            window.removeEventListener('click', endDrag, {capture: true});
        }
        
        window.addEventListener('mousemove', movePieceHandler);
        window.addEventListener('click', endDrag, {capture: true});
    }
    
    return <svg
        className="image-piece"
        fill="lime"
        strokeWidth="5"
        width={pieceWidth + curveSize * 2}
        height={pieceHeight + curveSize * 2}
        clipPath={`url(#clip-path-${uniqueId})`}
        style={{
            top: relevantPosition.y - curveSize,
            left: relevantPosition.x - curveSize,
            zIndex
        }}
        onClick={startDrag}
    >
        <defs>
            <path id={`outline-${uniqueId}`} d={shapePath} />
            <clipPath id={`clip-path-${uniqueId}`}>
                <use href={`#outline-${uniqueId}`} />
            </clipPath>
        </defs>
        <image
            href={imageUrl}
            width={imageWidth}
            height={imageHeight}
            x={- imageOffset.x}
            y={- imageOffset.y}
        />
        <use
            href={`#outline-${uniqueId}`}
            stroke="green"
            fill="none"
        />
    </svg>
}

export default ImagePiece;
export { Position };