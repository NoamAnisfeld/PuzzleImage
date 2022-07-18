import React, { useState } from "react";
import './GameBoard.scss';
import MainImage from "../MainImage/MainImage";
import CurvedGrid from "../CurvedGrid/CurvedGrid";
import ImagePiece from "../ImagePiece/ImagePiece";

function GameBoard({
    imageUrl,
    imageWidth,
    imageHeight,
    setImageAspectRatio
}: {
    imageUrl: string,
    imageWidth: number,
    imageHeight: number,
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
                // imageWidth,
                setImageAspectRatio
            }} />
            <CurvedGrid {...{
                imageWidth,
                imageHeight
            }}/>
            <ImagePiece {...{
                imageUrl,
            }}/>
        </div>
}

export default GameBoard;