import './ImagePiece.scss';
import { useContext } from 'react';
import { GlobalState } from '../../GlobalState/GlobalState';
import useDrag from './hooks/useDrag';
import { SVGPath } from '../../utils/SVGCurvePaths';

interface Position {
    x: number,
    y: number
}
type PositionUpdater = (newPosition: Position) => void;

function ImagePiece({
    uniqueId,
    imageOffset,
    shapePath,
    position,
    updatePosition,
    zIndex,
    putOnTop,
    isImageCompleted = false,
}: {
    uniqueId: string,
    imageOffset: {
        x: number,
        y: number
    }
    shapePath: SVGPath,
    position: Position,
    updatePosition: PositionUpdater,
    zIndex: number,
    putOnTop: () => void,
    isImageCompleted?: boolean,
}) {
    const {
        imageUrl,
        imageWidth,
        imageHeight,
        pieceWidth,
        pieceHeight,
        curveSize,
    } = useContext(GlobalState);

    const {
        isDragged,
        moveOffset,
        handleMouseDown,
        handleClick,
    } = useDrag({
        initialRestPosition: position,
        updateRestPosition: updatePosition,
        onStartDrag: () => putOnTop(),
    });

    const relevantPosition = isDragged ? {
        x: position.x + moveOffset.x,
        y: position.y + moveOffset.y
    } : position;
    
    return <svg
        className="image-piece"
        fill="lime"
        strokeWidth="3"
        width={pieceWidth + curveSize * 2}
        height={pieceHeight + curveSize * 2}
        clipPath={`url(#clip-path-${uniqueId})`}
        style={{
            top: relevantPosition.y - curveSize,
            left: relevantPosition.x - curveSize,
            zIndex
        }}
        onMouseDown={isImageCompleted ? undefined : handleMouseDown}
        onClick={isImageCompleted ? undefined : handleClick}
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
            stroke="black"
            fill="none"
        />
    </svg>
}

export default ImagePiece;
export { Position };