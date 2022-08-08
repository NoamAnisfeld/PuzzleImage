import './App.scss';
import { useReducer, useEffect, useContext, useRef, useState } from 'react';
import {
	GlobalStateInterface,
	GlobalState,
	globalStateDoCalculations,
	listenToWindowResize,
} from '../GlobalState/GlobalState';
import GameBoard from '../components/GameBoard/GameBoard';
import ControlPanel from '../components/ControlPanel/ControlPanel';

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
	
	const globalStateProviderRef = useRef<GlobalStateInterface>();
	globalStateProviderRef.current = globalStateProvider;
	useEffect(() =>
		listenToWindowResize(() => 
			setGlobalStateProvider(
				globalStateDoCalculations(globalStateProviderRef.current)
			)
		), []
	);
	
	function setImageUrl(url: string) {
		setGlobalStateProvider({ imageUrl: url });
	}

	function setImageAspectRatio(aspectRatio: number) {
		setGlobalStateProvider({ imageAspectRatio: aspectRatio });
	}
	
	const [isRestarting, setIsRestarting] = useState(true);
	useEffect(() => {
		setIsRestarting(false);
	}, [isRestarting])

	function triggerRestart() {
		setIsRestarting(true);
	}

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
				setImageAspectRatio,
				isRestarting,
			}}
		/>
		<ControlPanel
			{...{
				setImageUrl,
				triggerRestart,
			}}
		/>
	</GlobalState.Provider>
}

export default App;