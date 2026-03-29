import { useStore } from '@ui/store/store';
import { useEffect } from 'react';
import Body from './Body';


export type PageMap = Record<string, { icon: any, component: JSX.Element }>;

const App: React.FC = () => {
	useEffect(() => {
		useStore.getState().init()
	}, []);

	return (<>
		<main className="bg-custom-gray-300 h-screen w-screen flex flex-col">
			{/* Full-width drag area */}
			<div className='header h-5 w-full shrink-0' />
			<Body />
		</main>
	</>)
}
export default App;