import React from "react";

export default function MainImage({
    imageUrl,
    setImageAspectRatio,
    handleError
}: {
    imageUrl: string,
    setImageAspectRatio: (aspectRatio: number) => void,
    handleError?: () => void
}) {
    function handleImageLoad(event: React.SyntheticEvent<HTMLImageElement>) {
        const target = event.currentTarget;
        setImageAspectRatio(
            target.naturalWidth / target.naturalHeight);
    }

    return <img
        id="main-image"
        src={imageUrl}
        onLoad={handleImageLoad}
        onError={handleError || null}
    />
};