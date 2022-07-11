import { useState } from "react";
import MainImage from "./MainImage";

function GameBoard({
    imageUrl,
    imageWidth
}: {
    imageUrl: string,
    imageWidth: number
}) {
    const [imageAspectRatio, setImageAspectRatio] = useState(1);

    return <div id="game-wrapper">
        <MainImage {...{
            imageUrl,
            imageWidth,
            setImageAspectRatio
        }}
        />
    </div>
}

export default GameBoard;