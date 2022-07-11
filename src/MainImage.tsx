import React from "react";

export default function MainImage({
    imageUrl,
    imageWidth,
    setImageAspectRatio,
    handleError
}: {
    imageUrl: string,
    imageWidth: number,
    setImageAspectRatio: (aspectRatio: number) => void,
    handleError?: () => void
}) {
    function handleImageLoad(event: React.SyntheticEvent<HTMLImageElement>) {
        const target = event.currentTarget;
        setImageAspectRatio(
            target.naturalWidth / target.naturalHeight);
    }

    return <img
        src={imageUrl}
        style={{width: imageWidth}}
        onLoad={handleImageLoad}
        onError={handleError || null}
    />
};