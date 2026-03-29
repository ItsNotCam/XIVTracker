import { JobIconList } from '@ui/assets/images/jobs';
import { useStore } from '@ui/store/store';

const getJobIcon = (jobName: string | undefined) => {
	return jobName ? JobIconList[jobName.toLowerCase().replace(/ /g, "-")] : JobIconList["dark-knight"]
}

const UserTitleCard: React.FC = () => {
	const store = useStore();

	return (
		<div className='flex flex-col p-4'>
			<img className="w-18 h-18" src={getJobIcon(store.job?.name)} />
			<span className="font-forum text-xl text-custom-text-secondary-500">
				{store.playerName}
			</span>
			<span className='text-custom-text-primary-300'>
				{store.job?.name} <span className="text-xs">•</span> Lv {store.job?.level}
			</span>
		</div>
	)
}

export default UserTitleCard;