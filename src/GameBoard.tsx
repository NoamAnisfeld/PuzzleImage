import React, { useState } from "react";
import MainImage from "./MainImage";

function GameBoard({
    imageUrl,
    imageWidth,
    setImageAspectRatio
}: {
    imageUrl: string,
    imageWidth: number,
    setImageAspectRatio: (n: number) => void
}) {
    return <div
            id="game-wrapper"
            style={
                {
                    '--imageWidth': `${imageWidth}px`
                } as React.CSSProperties & {'--imageWidth': string}
            }
        >
            <MainImage {...{
                imageUrl,
                imageWidth,
                setImageAspectRatio
            }} />
        </div>
}

export default GameBoard;