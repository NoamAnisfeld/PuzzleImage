import { useState } from 'react';

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

	function handleChangeImage() {
		const newUrl = prompt("הכנס כתובת של תמונה");
		if (newUrl) {
			setImageUrl(newUrl);
		}
	}

	function handleStartGame() {
		setIsClosing(true);
		startGameCallback();
	}

	return (
		<div id="control-panel" className={isClosing ? "goaway-up" : null}>
			<form id="controls">
				<label>
					שורות:
					<input type="number" value={rows} onChange={handleChangeRows} />
				</label>
				<label>
					עמודות:
					<input type="number" value={cols} onChange={handleChangeCols} />
				</label>
				<button type="button" onClick={handleChangeImage}>
					החלפת תמונה
				</button>
				<button
					type="button"
					onClick={handleStartGame}
					// disabled={!imageAspectRatio}
				>
					צור פאזל
				</button>
			</form>
		</div>
	);
}

export { ControlPanel };