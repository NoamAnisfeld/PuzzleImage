import './ControlPanel.scss';
import UploadImageButton from './UploadImageButton/UploadImageButton';

function ControlPanel({
    setImageUrl,
}: {
    setImageUrl: (url: string) => void,
}) {
    return <div id="control-panel">
        Control panel
        <UploadImageButton {...{
                setImageUrl
            }
        } />
    </div>
}

export default ControlPanel;