import React, { useContext } from "react";
import { GlobalState } from "../GlobalState/GlobalState";
import './MainImage.scss';

export default function MainImage({
    setImageAspectRatio,
    handleError
}: {
    setImageAspectRatio: (aspectRatio: number) => void,
    handleError?: () => void
}) {
    const { imageUrl } = useContext(GlobalState);

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