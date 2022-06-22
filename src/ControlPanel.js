import { useState } from 'react';
import msg from './i18n';

function ControlPanel({
	rows,
	cols,
	setImageUrl,
	setRows,
	setCols,
	startGameCallback
}) {
	const
		[isClosing, setIsClosing] = useState(false);

	function handleChangeRows(event) {
		const n = Number(event.target.value);

		if (n > 0 && Number.isInteger(n)) {
			setRows(n);
		}
	}

	function handleChangeCols(event) {
		const n = Number(event.target.value);

		if (n > 0 && Number.isInteger(n)) {
			setCols(n);
		}
	}

	function handleImageFromUrl() {
		const newUrl = prompt(msg.insertURL);
		if (newUrl) {
			setImageUrl(newUrl);
		}
	}

	function handleImageFromFile({ target: { files: [file] } }) {
		if (!file instanceof File) {
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => setImageUrl(e.target.result);
		reader.readAsDataURL(file);
	}

	function handleStartGame() {
		setIsClosing(true);
		startGameCallback();
	}

	return (
		<div id="control-panel" className={isClosing ? "goaway-up" : null}>
			<form id="controls">
				<label>
					{msg.rows}:
					<input type="number" value={rows} onChange={handleChangeRows} />
				</label>
				<label>
					{msg.columns}:
					<input type="number" value={cols} onChange={handleChangeCols} />
				</label>
				<button type="button" className="button" onClick={handleImageFromUrl}>
					{msg.chooseImageFromURL}
				</button>
				<label className="button">
					{msg.uploadImage}
					<input
						className="visually-hidden"
						type="file"
						accept="image/*"
						onChange={handleImageFromFile} />
				</label>
				<button
					type="button"
					onClick={handleStartGame}
					// disabled={!imageAspectRatio}
				>
					{msg.start}
				</button>
			</form>
		</div>
	);
}

export { ControlPanel };