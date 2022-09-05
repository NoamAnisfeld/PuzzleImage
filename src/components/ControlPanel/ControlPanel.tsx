import './ControlPanel.scss';
import UploadImageButton from './UploadImageButton/UploadImageButton';
import RestartButton from './RestartButton/RestartButton';
import PiecesBox from './PiecesBox/PiecesBox';
import type { Position } from '../ImagePiece/ImagePiece';

function ControlPanel({
    setImageUrl,
    triggerRestart,
    pickPiece,
}: {
    setImageUrl: (url: string) => void,
    triggerRestart: () => void,
    pickPiece: (position: Position) => void,
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
    </div>
}

export default ControlPanel;