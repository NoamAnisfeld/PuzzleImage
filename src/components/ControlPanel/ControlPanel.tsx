import './ControlPanel.scss';
import UploadImageButton from './UploadImageButton/UploadImageButton';
import RestartButton from './RestartButton/RestartButton';
import PiecesBox from './PiecesBox/PiecesBox';

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
        <PiecesBox />
    </div>
}

export default ControlPanel;