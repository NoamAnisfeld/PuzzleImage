import { useState, useContext, useEffect } from "react";
import { GlobalState } from '../../../GlobalState/GlobalState';

interface Position {
    x: number,
    y: number
}
type PositionUpdater = (newPosition: Position) => void;

export default function useDrag({
    initialRestPosition,
    updateRestPosition,
    onStartDrag,
}: {
    initialRestPosition: Position,
    updateRestPosition: PositionUpdater,
    onStartDrag?: () => void,
}) {
    const {
        imageWidth,
        imageHeight,
        pieceWidth,
        pieceHeight,
        curveSize,
        stickyDraggingMode,
    } = useContext(GlobalState);

    const
        [isDragged, setIsDragged] = useState(false),
        [moveOffset, setMoveOffset] = useState<Position>({
            x: 0,
            y: 0
        });

    useEffect(() => {
        if (!isDragged) {
            updateRestPositionWithAutoAlign({
                x: initialRestPosition.x + moveOffset.x,
                y: initialRestPosition.y + moveOffset.y
            });
        }
        setMoveOffset({ x: 0, y: 0 });
    }, [isDragged]);

    function autoAlignRestPosition({ x, y }: Position) {

        // don't align if it's out of the image border
        if (x < -(pieceWidth + 2 * curveSize) ||
            x > (imageWidth - curveSize) ||
            y < -(pieceHeight + 2 * curveSize) ||
            y > (imageHeight - curveSize)
        ) {
            return { x, y };
        }

        const remainderX = Math.abs(x % pieceWidth),
            remainderY = Math.abs(y % pieceHeight);

        const DISTANCE_FOR_NORMALIZATION = Math.min(
            pieceWidth / 4,
            pieceHeight / 4,
            20
        );

        return {
            x: 
                remainderX < DISTANCE_FOR_NORMALIZATION ?
                    x - remainderX
                :  remainderX + DISTANCE_FOR_NORMALIZATION > pieceWidth ?
                    x - remainderX + pieceWidth
                :
                    x,

            y:
                remainderY < DISTANCE_FOR_NORMALIZATION ?
                    y - remainderY
                : remainderY + DISTANCE_FOR_NORMALIZATION > pieceHeight ?
                    y - remainderY + pieceHeight
                :
                    y
        }
    }

    function updateRestPositionWithAutoAlign(newPosition: Position) {
        updateRestPosition(autoAlignRestPosition(newPosition));
    }

    function handleMouseDown(event: React.MouseEvent) {
        if (!(event.target instanceof Element) ||
            isDragged ||
            stickyDraggingMode
        ) return;

        event.preventDefault();

        const dragObject = startDrag({
            x: event.pageX,
            y: event.pageY,
        });
        
        function endDrag(event: MouseEvent) {
            event.stopPropagation();
            window.removeEventListener('mouseup', endDrag, { capture: true });
            dragObject.endDrag();
        }
        window.addEventListener('mouseup', endDrag, { capture: true });
    }

    function handleClick(event: React.MouseEvent) {
        if (!(event.target instanceof Element) ||
            isDragged ||
            !stickyDraggingMode
        ) return;

        const dragObject = startDrag({
            x: event.pageX,
            y: event.pageY,
        });
        
        function endDrag(event: MouseEvent) {
            event.stopPropagation();
            window.removeEventListener('click', endDrag, { capture: true });
            dragObject.endDrag();
        }
        window.addEventListener('click', endDrag, { capture: true });
    }

    function startDrag(initialPageOffset: Position) {
        setIsDragged(true);
        setMoveOffset({ x: 0, y: 0 });
        if (onStartDrag) onStartDrag();

        function handleMouseMove(event: MouseEvent) {
            setMoveOffset({
                x: event.pageX - initialPageOffset.x,
                y: event.pageY - initialPageOffset.y
            })
        }
        window.addEventListener('mousemove', handleMouseMove);

        return {
            endDrag() {
                setIsDragged(false);
                window.removeEventListener('mousemove', handleMouseMove);
            }
        }
    }

    return {
        isDragged,
        moveOffset,
        handleMouseDown,
        handleClick,
    }
}