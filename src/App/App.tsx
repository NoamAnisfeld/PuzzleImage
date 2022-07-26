import './App.scss';
import { useReducer, useEffect, useContext } from 'react';
import { GlobalStateInterface, GlobalState, listenToWindowResize, globalStateDoCalculations } from '../GlobalState/GlobalState';
import GameBoard from '../GameBoard/GameBoard';

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
		<GameBoard
			{...{
				setImageAspectRatio
			}}
		/>
	</GlobalState.Provider>
}

export default App;