import './ImagePiece.scss';
import { SVGPath } from '../SVGPaths/SVGCurvePaths';

function ImagePiece({
    imageUrl,
    imageWidth,
    imageOffset,
    shapePath,
} :{
    imageUrl: string,
    imageWidth: number,
    imageOffset: {
        x: number,
        y: number
    }
    shapePath: SVGPath,
}) {
    return <svg
        className="image-piece"
        stroke="green"
        fill="lime"
    >
        <path id="outline" d={shapePath} />
        <clipPath id="clip-path">
            <use href="#outline" />
        </clipPath>
        <image
            href={imageUrl}
            width={imageWidth}
            x={- imageOffset.x}
            y={- imageOffset.y}
            clipPath="url(#clip-path)" />
    </svg>
}

export default ImagePiece;