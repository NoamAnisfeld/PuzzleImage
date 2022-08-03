import './App.scss';
import { useReducer, useEffect, useContext, useRef } from 'react';
import { GlobalStateInterface, GlobalState, listenToWindowResize, globalStateDoCalculations } from '../GlobalState/GlobalState';
import GameBoard from '../components/CurvedGrid/GameBoard/GameBoard';
import UploadImageButton from '../components/UploadImageButton/UploadImageButton';

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
		setGlobalStateProvider({ imageAspectRatio: aspectRatio });
	}
	
	const globalStateProviderRef = useRef<GlobalStateInterface>();
	globalStateProviderRef.current = globalStateProvider;
	useEffect(() =>
		listenToWindowResize(() => 
			setGlobalStateProvider(
				globalStateDoCalculations(globalStateProviderRef.current)
			)
		), []
	);

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
		<UploadImageButton
			{...{
				setImageUrl
			}}
		/>
	</GlobalState.Provider>
}

export default App;