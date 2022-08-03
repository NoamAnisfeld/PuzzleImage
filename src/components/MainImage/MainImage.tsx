import React, { useContext } from "react";
import { GlobalState } from "../../GlobalState/GlobalState";
import './MainImage.scss';

export default function MainImage({
    isImageCompleted,
    setImageAspectRatio,
    handleError
}: {
    isImageCompleted: boolean,
    setImageAspectRatio: (aspectRatio: number) => void,
    handleError?: () => void
}) {
    const { imageUrl, imageWidth, imageHeight } = useContext(GlobalState);

    function handleImageLoad(event: React.SyntheticEvent<HTMLImageElement>) {
        const target = event.currentTarget;
        setImageAspectRatio(
            target.naturalWidth / target.naturalHeight
        );
    }

    return <img
        id="main-image"
        className={isImageCompleted ? 'completed' : undefined}
        src={imageUrl}
        width={imageWidth}
        height={imageHeight}
        onLoad={handleImageLoad}
        onError={handleError}
    />
};