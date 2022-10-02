import './ControlPanel.scss';
import UploadImageButton from './UploadImageButton/UploadImageButton';
import RestartButton from './RestartButton/RestartButton';
import PiecesBox from './PiecesBox/PiecesBox';
import type { Position } from '../ImagePiece/ImagePiece';

function ControlPanel({
    setImageUrl,
    triggerRestart,
    pickPiece,
    stickyDragMode,
    setStickyDragMode,
}: {
    setImageUrl: (url: string) => void,
    triggerRestart: () => void,
    pickPiece: (position: Position) => void,
    stickyDragMode: boolean,
    setStickyDragMode: (value: boolean) => void,
}) {
    return <div id="control-panel">
        Control panel
        <UploadImageButton {...{
            setImageUrl
        }} />
        <RestartButton {...{
            triggerRestart
        }} />
        <PiecesBox {...{
            pickPiece
        }}/>
        <label>
            Sticky dragging mode
        <input
            type="checkbox"
            checked={stickyDragMode}
            onChange={e => setStickyDragMode(e.target.checked)}
        />
        </label>
    </div>
}

export default ControlPanel;