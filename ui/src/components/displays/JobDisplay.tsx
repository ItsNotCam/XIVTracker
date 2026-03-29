import { JobIconList } from '@ui/assets/images/jobs';
import { useStore } from '@ui/store/store';

const JobDisplay = () => {
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
				</h1>
			</div>
		</div>
	)
}
export default JobDisplay;