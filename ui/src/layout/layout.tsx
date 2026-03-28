import Header from '@layout/Header/Header';
import Body from '@layout/Body/Body';
import { useStore } from '@ui/store/store';
import { useEffect, useState } from 'react';
import ClockImage from '@assets/images/etc-clock.png';
import { JobIconList } from '@ui/assets/images/jobs';
import LocationDisplay from '@ui/components/displays/LocationDisplay';


export type PageMap = Record<string, { icon: any, component: JSX.Element }>;

export const pages: PageMap = {
	// Crafting: {
	// 	icon: CraftingImage,
	// 	component: <RecipeSearch />
	// },
	// Jobs: {
	// 	icon: JobsImage,
	// 	component: <Jobs />
	// }
};

const getJobIcon = (jobName: string | undefined) => {
	return jobName ? JobIconList[jobName.toLowerCase().replace(/ /g, "-")] : JobIconList["dark-knight"]
}

const Job = () => {
	const { job } = useStore();

	return (
		<div className="flex flex-row gap-1 p-6">
			<img
				className="w-17 h-17"
				src={job ? JobIconList[job.name.toLowerCase().replace(/ /g, "-")] : JobIconList["dark-knight"]}
			/>
			<div className="flex flex-col items-start my-auto">
				<h2 className="text-custom-text-secondary-300 text-lg row-start-1 row-end-2 col-start-2 col-end-3 ml-[0.6rem]">
					LEVEL {job ? job.level : 0}
				</h2>
				<h1 className={`
							text-custom-text-secondary-500 text-2xl font-forum col-start-2
							col-end-3 row-start-2 row-end-3 ml-2 uppercase
						`}>
					<span className='text-[1.3em]'>{job?.name}</span>
					{/* <span className="text-3xl bloom">
						{job ? job.name[0] : "u"}
					</span>
					<span className="">
						{job ? job.name.slice(1).toLowerCase() : "ninitialized"}
					</span> */}
				</h1>
			</div>
		</div>
	)
}

const ExitDialog: React.FC<{ onConfirm: () => void; onCancel: () => void }> = ({ onConfirm, onCancel }) => (
	<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'>
		<div className='bg-[hsl(36,33%,4%)] border border-[hsl(42,45%,17%)] rounded-lg shadow-2xl w-72 overflow-hidden'>
			<div className='bg-[hsl(42,43%,8%)] border-b border-[hsl(42,45%,17%)] px-5 py-3 flex items-center gap-3'>
				<svg xmlns="http://www.w3.org/2000/svg" height="1.1rem" viewBox="0 -960 960 960" width="1.1rem" className='fill-custom-text-secondary-500 shrink-0'>
					<path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
				</svg>
				<span className='font-forum text-custom-text-secondary-500 uppercase tracking-widest text-sm'>Close Application</span>
			</div>
			<div className='px-5 py-4'>
				<p className='text-custom-text-primary-300 text-sm'>Are you sure you want to close XIVTracker?</p>
			</div>
			<div className='px-5 pb-4 flex flex-row gap-2 justify-end'>
				<button
					onClick={onCancel}
					className='cursor-pointer px-4 py-1.5 text-sm rounded border border-[hsl(42,45%,17%)] text-custom-text-primary-500 hover:bg-[hsl(42,43%,9%)] hover:text-custom-text-primary-300 transition-colors'
				>
					Cancel
				</button>
				<button
					onClick={onConfirm}
					className='cursor-pointer px-4 py-1.5 text-sm rounded bg-red-900/50 border border-red-800/60 text-red-300 hover:bg-red-800/60 hover:text-red-200 transition-colors'
				>
					Close
				</button>
			</div>
		</div>
	</div>
);

const App: React.FC = () => {
	let store = useStore();
	const [showExitDialog, setShowExitDialog] = useState(false);

	// App.tsx
	useEffect(() => {
		useStore.getState().init()
	}, []);



	return (
		<main className="bg-custom-gray-300 h-full w-full flex flex-col">
			{showExitDialog && (
				<ExitDialog
					onConfirm={() => window.ipcRenderer.send('exit')}
					onCancel={() => setShowExitDialog(false)}
				/>
			)}
			{/* Full-width drag area */}
			<div className='header h-5 w-full shrink-0' />
			<div className='flex flex-row flex-1 min-h-0'>

				{/* Left Sidebar */}
				<div className='w-50 bg-[hsl(36,33%,3%)] h-full border-r border-[hsl(42,45%,17%)] flex flex-col overflow-hidden'>

					{/* Title Card */}
					<div className='flex flex-col p-4'>
						<img className="w-18 h-18" src={getJobIcon(store.job?.name)} />
						<span className="font-forum text-xl text-custom-text-secondary-500">
							{store.playerName}
						</span>
						<span className='text-custom-text-primary-300'>
							{store.job?.name} <span className="text-xs">•</span> Lv {store.job?.level}
						</span>
					</div>

					{/* Connection Status */}
					<div className='border-t border-[hsl(42,45%,17%)] flex flex-row items-center gap-2 mt-auto p-4'>
						<div className='relative flex items-center justify-center'>
							<div className={`absolute h-3 w-3 rounded-full animate-ping opacity-60 ${store.socketConnected ? 'bg-green-500' : 'bg-red-500'}`} />
							<div className={`h-2 w-2 rounded-full ${store.socketConnected ? 'bg-green-400' : 'bg-red-400'}`} />
						</div>
						<span className='text-sm text-custom-gray-100/50'>
							{store.socketConnected ? 'Connected' : 'Disconnected'}
						</span>
						<button
							className='cursor-pointer ml-auto rounded-full p-1 hover:bg-red-900/40 text-custom-gray-100/30 hover:text-red-400 transition-colors'
							title='Close application'
							onClick={() => setShowExitDialog(true)}
						>
							<svg xmlns="http://www.w3.org/2000/svg" height="1.1rem" viewBox="0 -960 960 960" width="1.1rem" fill="currentColor">
								<path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
							</svg>
						</button>
					</div>
				</div>

				{/* Center Section */}
				<div className='w-auto grow bg-[hsl(38,31%,5%)] h-full grid grid-rows-[7rem_auto_auto]'>

					{/* Header */}
					<div className='
						flex flex-row justify-between items-center 
						border-b border-[hsl(42,45%,17%)] 
						bg-linear-to-r from-[hsl(42,43%,9%)] via-[hsl(38,31%,5%)] to-[hsl(38,31%,5%)]
					'>
						<Job />
						<div className="flex flex-col ml-auto items-end gap-2">
							<LocationDisplay />
							<div className="flex flex-row gap-2 items-center">
								<span className='text-custom-text-secondary-500'>{store.currentTime.toUpperCase()}</span>
								<span className='opacity-50'>•</span>
								<span className='text-custom-text-secondary-500'>{store.worldTime.toUpperCase()}</span>
								<span className='opacity-50'>Eorzea</span>
							</div>
						</div>
							<img className="h-14 mx-2" src={ClockImage} />
					</div>

					{/* EXP Bar */}
					<div className='
						grid grid-cols-[auto_1fr_auto] gap-4 items-center h-10 
						py-2 px-4 border-b border-[hsl(42,45%,17%)]
					'>
						<span>{store.playerName}</span>
						<div className="bg-custom-gray-200 rounded-full">
							<div 
								style={{ width: store.job ? `${(store.job.expCurrent / store.job.expMax) * 100}%` : 0 }} 
								className="h-2 bg-gradient-xp-horizontal rounded-l-full w-full transition-[width]" 
							/>
						</div>
						<p className='text-custom-text-secondary-100'>
							<span className='text-custom-text-primary-500 text-sm'>EXP</span>{" "}
							<span className="bloom">{store.job?.expCurrent.toLocaleString()}</span>{" "}
							<span className='text-custom-text-primary-500'>/{store.job?.expMax.toLocaleString()}</span>
						</p>
					</div>

					{/* Main Content */}
					<div></div>
				</div>

				{/* Sidebar Foldout */}
				<div className='w-0 bg-orange-50 h-full'></div>
			</div>
		</main>
	)

	//  grid grid-rows-[auto_1fr]">
	// <main className="bg-custom-gray-300 h-screen w-screen"> 
	return (<main className="bg-custom-gray-300 h-screen w-screen grid grid-rows-[auto_1fr]">
		<Header />
		<Body />
		{/* <Header /> */}
		{/* <div className='grid grid-cols-[auto_1fr_auto] w-full h-full'>
		<div className='w-60 bg-custom-gray-200'></div>
		<div className='bg-custom-gray-500'></div>
		<div className='w-60 bg-custom-gray-200'></div>
	</div> */}
	</main>)
}
export default App;