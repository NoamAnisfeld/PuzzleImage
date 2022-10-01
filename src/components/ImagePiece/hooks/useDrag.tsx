import { useState, useContext } from "react";
import { GlobalState } from '../../../GlobalState/GlobalState';

interface Position {
    x: number,
    y: number
}

export default function useDrag({
    position,
    updatePosition,
    putOnTop,
}: {
    position: Position,
    updatePosition: (newPosition: Position) => void,
    putOnTop: () => void,
}) {
    const {
        imageWidth,
        imageHeight,
        pieceWidth,
        pieceHeight,
        curveSize,
    } = useContext(GlobalState);

    const
        [isDragged, setIsDragged] = useState(false),
        [positionDuringDrag, setPositionDuringDrag] = useState<Position>(),
        relevantPosition = isDragged ? positionDuringDrag : position;

    function normalizePosition({ x, y }: Position) {
        const normalized: Position = { x, y };

        // don't normalize if it's out of the image border
        if (x < -(pieceWidth + 2 * curveSize) ||
            x > (imageWidth - curveSize) ||
            y < -(pieceHeight + 2 * curveSize) ||
            y > (imageHeight - curveSize)
        ) {
            return normalized;
        }

        const remainderX = Math.abs(x % pieceWidth),
            remainderY = Math.abs(y % pieceHeight);

        const DISTANCE_FOR_NORMALIZATION = Math.min(
            pieceWidth / 4,
            pieceHeight / 4,
            20
        );

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
            window.removeEventListener('click', endDrag, { capture: true });
        }

        window.addEventListener('mousemove', movePieceHandler);
        window.addEventListener('click', endDrag, { capture: true });
    }

    return {
        relevantPosition,
        startDrag,
    }
}