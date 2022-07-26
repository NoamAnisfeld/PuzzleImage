import './ImagePiece.scss';
import { useContext, useState } from 'react';
import { GlobalState } from '../GlobalState/GlobalState';
import { SVGPath } from '../SVGPaths/SVGCurvePaths';

interface Position {
    x: number,
    y: number
}

function ImagePiece({
    // imageUrl,
    // imageWidth,
    // imageHeight,
    // pieceWidth,
    // pieceHeight,
    // curveSize,
    imageOffset,
    shapePath,
    row,
    col,
    zIndex,
    putOnTop,
}: {
    // imageUrl: string,
    // imageWidth: number,
    // imageHeight: number,
    // pieceWidth: number,
    // pieceHeight: number,
    // curveSize: number,
    imageOffset: {
        x: number,
        y: number
    }
    shapePath: SVGPath,
    row: number,
    col: number,
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

    const [position, setPosition] = useState<Position>({
        x: col * pieceWidth - imageWidth,
        y: row * pieceHeight
    });
    const [isDragged, setIsDragged] = useState(false);

    function normalizePosition({x, y}: Position) {
        const normalized: Position = {x, y};

        const remainderX = x % pieceWidth,
            remainderY = y % pieceHeight;
        
        if (remainderX < 20) {
            normalized.x -= remainderX;
        } else if (pieceWidth - remainderX < 20) {
            normalized.x += pieceWidth - remainderX;
        }

        if (remainderY < 20) {
            normalized.y -= remainderY;
        } else if (pieceHeight - remainderY < 20) {
            normalized.y += pieceHeight - remainderY;
        }

        return normalized;
    }

    function startDrag(event: React.MouseEvent) {
        setIsDragged(true);
        putOnTop();

        const originalRelativePosition = {
            x: position.x - event.clientX,
            y: position.y - event.clientY
        };

        function movePieceHandler(event: MouseEvent) {
            setPosition({
                x: originalRelativePosition.x + event.clientX,
                y: originalRelativePosition.y + event.clientY
            })
        }

        function endDrag(event: MouseEvent) {
            event.stopPropagation();

            setPosition(normalizePosition);

            window.removeEventListener('mousemove', movePieceHandler);
            window.removeEventListener('click', endDrag, {capture: true});
        }
        
        window.addEventListener('mousemove', movePieceHandler);
        window.addEventListener('click', endDrag, {capture: true});
    }
    
    return <svg
        className="image-piece"
        fill="lime"
        width={imageWidth} // automatic sizing does not work well with SVG
        height={imageHeight}
        clipPath={`url(#clip-path-${row}-${col})`}
        style={{
            top: position.y - curveSize,
            left: position.x - curveSize,
            zIndex
        }}
        onClick={startDrag}
    >
        <defs>
            <path id={`outline-${row}-${col}`} d={shapePath} />
            <clipPath id={`clip-path-${row}-${col}`}>
                <use href={`#outline-${row}-${col}`} />
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
            href={`#outline-${row}-${col}`}
            stroke="green"
            stroke-width="5"
            fill="none"
        />
    </svg>
}

export default ImagePiece;