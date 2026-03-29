import { useStore } from '@ui/store/store';

const Clock: React.FC = () => {
	const store = useStore();
	return (
		<div className="flex flex-row gap-2 items-center">
			<span className='text-custom-text-secondary-500'>{store.currentTime.toUpperCase()}</span>
			<span className='opacity-50'>•</span>
			<span className='text-custom-text-secondary-500'>{store.worldTime.toUpperCase()}</span>
			<span className='opacity-50'>Eorzea</span>
		</div>
	);
};

export default Clock;
