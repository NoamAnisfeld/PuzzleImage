import './App.scss';
import { useReducer, useEffect, useContext } from 'react';
import { GlobalStateInterface, GlobalState, listenToWindowResize, globalStateDoCalculations } from '../GlobalState/GlobalState';
import GameBoard from '../GameBoard/GameBoard';
import UploadImageButton from '../components/UploadImageButton';

function App() {

	const [globalStateProvider, setGlobalStateProvider] =
		useReducer(
			function (
				oldState: GlobalStateInterface,
				newState: Partial<GlobalStateInterface>
			): GlobalStateInterface {
				return globalStateDoCalculations({...oldState, ...newState});
			},
			useContext(GlobalState)
		);

	function setImageUrl(url: string) {
		setGlobalStateProvider({ imageUrl: url });
	}

	function setImageAspectRatio(aspectRatio: number) {
		console.log('setImageAspectRatio: ', aspectRatio);
		setGlobalStateProvider({ imageAspectRatio: aspectRatio });
	}
	
	useEffect(() =>
		listenToWindowResize(() => 
			setGlobalStateProvider(globalStateDoCalculations(globalStateProvider)))
	, []);

    return <GlobalState.Provider value={{...globalStateProvider}}>
		{globalStateProvider.developmentMode &&
			<span style={{
				position: "fixed",
				top: 0,
				right: 0
			}}>Development mode</span>
		}
		<GameBoard
			{...{
				setImageAspectRatio
			}}
		/>
		<UploadImageButton {...{
			setImageUrl
		}}/>
	</GlobalState.Provider>
}

export default App;