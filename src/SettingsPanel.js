import { createContext, useState } from 'react';

const defaultSettings = {
    imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/%D0%A0%D0%B0%D0%BD%D0%BE%D0%BA_%D0%BD%D0%B0_%D0%9C%D0%B0%D0%BD%D0%B3%D1%83%D0%BF%D1%96.jpg/750px-%D0%A0%D0%B0%D0%BD%D0%BE%D0%BA_%D0%BD%D0%B0_%D0%9C%D0%B0%D0%BD%D0%B3%D1%83%D0%F%D1%96.jpg",
    imageWidth: Math.max(300, window.innerWidth * 0.5),
    rows: 3,
    cols: 2
};

const GlobalSettings = createContext(defaultSettings);

/*
 * @prop startGameCallback {function(settings:{object})}
 */
function SettingsPanel({ setImageUrl, rows, cols, setRows, setCols, startGameCallback }) {
	const
		// [imageUrl, setImageUrl] = useState(defaultSettings.imageUrl),
		// [imageAspectRatio, setImageAspectRatio] = useState(null),
		// [rows, setRows] = useState(defaultSettings.rows),
		// [cols, setCols] = useState(defaultSettings.cols),
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
			// setImageAspectRatio(null); // perhaps don't to if it's the same URL as before because it wouldn't onLoad?
		}
	}

	function handleStartGame() {
		setIsClosing(true);

		startGameCallback({
			// imageUrl: imageUrl,
			// imageAspectRatio: imageAspectRatio,
			// rows: rows,
			// cols: cols
		});
	}

	return (
		<div id="settings-panel" className={isClosing ? "goaway-up" : null}>
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
			{/* <img
				src={imageUrl}
				onLoad={(e) =>
					setImageAspectRatio(e.target.naturalWidth / e.target.naturalHeight)
				}
			/> */}
		</div>
	);
}

export { defaultSettings, GlobalSettings, SettingsPanel };