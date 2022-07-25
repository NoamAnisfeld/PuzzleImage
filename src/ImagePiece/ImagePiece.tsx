import './ImagePiece.scss';
import { SVGPath } from '../SVGPaths/SVGCurvePaths';
import { useState } from 'react';

interface Position {
    x: number,
    y: number
}

function ImagePiece({
    imageUrl,
    imageWidth,
    imageHeight,
    imageOffset,
    shapePath,
    row,
    col
} :{
    imageUrl: string,
    imageWidth: number,
    imageHeight: number,
    imageOffset: {
        x: number,
        y: number
    }
    shapePath: SVGPath,
    row: number,
    col: number
}) {
    const [position, setPosition] = useState<Position>({
        x: 0,
        y: 0
    })

    function makePieceDraggable(event: React.MouseEvent) {
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

        function removeHandlers(event: MouseEvent) {
            event.stopPropagation();
            window.removeEventListener('mousemove', movePieceHandler);
            window.removeEventListener('click', removeHandlers, {capture: true});
        }
        
        window.addEventListener('mousemove', movePieceHandler);
        window.addEventListener('click', removeHandlers, {capture: true});
    }

    return <svg
        className="image-piece"
        stroke="green"
        fill="lime"
        width={imageWidth} // looks like automatic sizing does not work well with SVG
        height={imageHeight}
        style={{top: position.y, left: position.x}}
    >
        <path id={`outline-${row}-${col}`} d={shapePath} />
        <clipPath id={`clip-path-${row}-${col}`}>
            <use href={`#outline-${row}-${col}`} />
        </clipPath>
        <image
            href={imageUrl}
            width={imageWidth}
            height={imageHeight}
            x={- imageOffset.x}
            y={- imageOffset.y}
            clipPath={`url(#clip-path-${row}-${col})`}
            onClick={makePieceDraggable}
        />
    </svg>
}

export default ImagePiece;