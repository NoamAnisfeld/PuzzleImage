import React from 'react';
import './UploadImageButton.scss';

function UploadImageButton({
    setImageUrl
}: {
    setImageUrl: (url: string) => void
}) {

    function handleChosenFile(event: React.ChangeEvent<HTMLInputElement>) {
        const target = event.target,
            files = target.files,
            file = files[0];

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target.result;
            if (typeof result === 'string') { // make TS happy; should always be a string with readAsDataURL()
                setImageUrl(result);
            }
        }
        reader.readAsDataURL(file);
    }

    return <label className="upload-image-button">
        Upload image
            <input type="file"
				accept="image/*"
                className="visually-hidden"
                onChange={handleChosenFile}
            />
        </label>
}

export default UploadImageButton;