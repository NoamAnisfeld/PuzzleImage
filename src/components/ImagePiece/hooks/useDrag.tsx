import { useState, useContext } from "react";
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
    } = useContext(GlobalState);

    const
        [isDragged, setIsDragged] = useState(false),
        [moveOffset, setMoveOffset] = useState<Position>({
            x: 0,
            y: 0
        });

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

    function handleClick(event: React.MouseEvent) {
        if (!(event.target instanceof Element))
            return;
        
        if (isDragged)
            return;

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

    function handleMouseDown(event: React.MouseEvent) {

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
                setMoveOffset(moveOffset => {
                    updateRestPositionWithAutoAlign({
                        x: initialRestPosition.x + moveOffset.x,
                        y: initialRestPosition.y + moveOffset.y
                    });
                    return { x: 0, y: 0 };
                });
                window.removeEventListener('mousemove', handleMouseMove);
            }
        }
    }

    // function oldStartDrag(event: React.MouseEvent) {
    //     setIsDragged(true);
    //     setPosition(restPosition);
    //     putOnTop();

    //     const relativeRestPosition = {
    //         x: restPosition.x - event.pageX,
    //         y: restPosition.y - event.pageY
    //     };

    //     function movePieceHandler(event: MouseEvent) {
    //         setPosition({
    //             x: relativeRestPosition.x + event.pageX,
    //             y: relativeRestPosition.y + event.pageY
    //         })
    //     }

    //     function endDrag(event: MouseEvent) {
    //         event.stopPropagation();
    //         setIsDragged(false);

    //         updateRestPosition(normalizeRestPosition({
    //             x: relativeRestPosition.x + event.pageX,
    //             y: relativeRestPosition.y + event.pageY
    //         }));

    //         window.removeEventListener('mousemove', movePieceHandler);
    //         window.removeEventListener('click', endDrag, { capture: true });
    //     }

    //     window.addEventListener('mousemove', movePieceHandler);
    //     window.addEventListener('click', endDrag, { capture: true });
    // }

    return {
        isDragged,
        moveOffset,
        handleClick,
    }
}