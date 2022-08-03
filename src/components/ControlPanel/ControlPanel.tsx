import './ControlPanel.scss';
import UploadImageButton from './UploadImageButton/UploadImageButton';
import RestartButton from './RestartButton/RestartButton';

function ControlPanel({
    setImageUrl,
    triggerRestart,
}: {
    setImageUrl: (url: string) => void,
    triggerRestart: () => void,
}) {
    return <div id="control-panel">
        Control panel
        <UploadImageButton {...{
            setImageUrl
        }} />
        <RestartButton {...{
            triggerRestart
        }} />
    </div>
}

export default ControlPanel;