import Header from '@ui/layout/Header/Header';
import Body from '@ui/layout/Body/Body';
import { useStore } from '@ui/store/store';
import { useEffect } from 'react';
import { invoke } from '@ui/util/util';

const App: React.FC = () => {

	useEffect(() => {
		useStore.getState().init();
		invoke("global:init")
	}, []);

	return (
		//  grid grid-rows-[auto_1fr]">
		// <main className="bg-custom-gray-300 h-screen w-screen"> 
		<main className="bg-custom-gray-300 h-screen w-screen grid grid-rows-[auto_1fr]">
			<Header />
			<Body />
			{/* <Header /> */}
			{/* <div className='grid grid-cols-[auto_1fr_auto] w-full h-full'>
			<div className='w-60 bg-custom-gray-200'></div>
			<div className='bg-custom-gray-500'></div>
			<div className='w-60 bg-custom-gray-200'></div>
		</div> */}
		</main>
	);
}
export default App;