import './ImagePiece.scss';
import { SVGPath } from '../SVGPaths/SVGCurvePaths';

function ImagePiece({
    imageUrl,
    shapePath,
} :{
    imageUrl: string,
    shapePath?: SVGPath,
}) {
    console.log(imageUrl);
    const path = shapePath || 
        // development demo
        "M0,0h22.28c13.37 2.67 -13.37 12.03 13.37 13.37 26.73 -1.34 0 -10.69 13.37 -13.37h22.28" +
        "v66.83" +
        "M0,0v66.83" +
        "h22.28c13.37 2.67 -13.37 12.03 13.37 13.37 26.73 -1.34 0 -10.69 13.37 -13.37h22.28"
        ;

    return <svg
        className="image-piece"
        stroke="green"
        fill="lime"
    >
        <path id="outline" d={path} />
        <clipPath id="clip-path">
            <use href="#outline" />
        </clipPath>
        <image href={imageUrl} clipPath="url(#clip-path)" />
    </svg>
}

export default ImagePiece;