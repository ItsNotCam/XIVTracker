import Header from '@layout/Header/Header';
import Body from '@layout/Body/Body';
import { useStore } from '@ui/store/store';
import { useEffect } from 'react';
import ClockImage from '@assets/images/etc-clock.png';
import { JobIconList } from '@ui/assets/images/jobs';
import LocationDisplay from '@ui/components/displays/LocationDisplay';
import XPBar from '@ui/components/ui/XPBar';


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
		<div className="flex flex-row gap-2 p-6">
			<img
				className="w-15 h-15"
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
					<span className="text-3xl">
						{job ? job.name[0] : "u"}
					</span>
					<span className="text-3l">
						{job ? job.name.slice(1).toLowerCase() : "ninitialized"}
					</span>
				</h1>
			</div>
		</div>
	)
}

const App: React.FC = () => {
	let store = useStore();

	// App.tsx
	useEffect(() => {
		useStore.getState().init()
	}, []);



	return (
		<main className="bg-custom-gray-300 h-screen w-screen">
			<div className='flex flex-row h-full'>

				{/* Title Card */}
				<div className='w-50 bg-[hsl(36,33%,3%)] h-full border-r border-[hsl(42,45%,17%)] p-4'>
					<div className='flex flex-col'>
						<img className="w-15 h-15" src={getJobIcon(store.job?.name)} />
						<span className="font-forum text-xl text-custom-text-secondary-500">
							{store.playerName}
						</span>
						<span className='text-custom-text-primary-300'>
							{store.job?.name} <span className="text-xs">•</span> Lv {store.job?.level}
						</span>
					</div>
				</div>

				{/* Center Section */}
				<div className='w-auto grow bg-[hsl(38,31%,5%)] h-full grid grid-rows-[7rem_auto_auto]'>
					<div className='flex flex-row justify-between items-center border-b border-[hsl(42,45%,17%)]'>
						<Job />
						<div className="flex flex-col pr-6 items-end gap-2">
							<LocationDisplay />
							<div className="flex flex-row gap-2 items-center">
								<span className='text-custom-text-secondary-500'>{store.currentTime.toUpperCase()}</span>
								<span className='opacity-50'>•</span>
								<span className='text-custom-text-secondary-500'>{store.worldTime.toUpperCase()}</span>
								<span className='opacity-50'>Eorzea</span>
								<img className="h-8" src={ClockImage} />
							</div>
						</div>
					</div>
					<div className='grid grid-cols-[auto_1fr_auto] gap-4 items-center h-10 py-2 px-4 border-b border-[hsl(42,45%,17%)]'>
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
							<span className='text-custom-text-primary-500 text-sm'>/{store.job?.expMax.toLocaleString()}</span>
						</p>
					</div>
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