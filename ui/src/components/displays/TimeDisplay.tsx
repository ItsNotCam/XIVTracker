import ClockImage from '@assets/images/etc-clock.png';
import { useStore } from '@ui/store/store';

const Clock: React.FC = () => {
	const { currentTime, worldTime } = useStore();

	return (
		<div className="grid grid-cols-[1fr_auto] h-fit mb-2">
			<div className='flex flex-col justify-center items-end'>
				<h1 className="text-2xl">{currentTime}</h1>
				<h2 className="text-lg">{worldTime}</h2>
			</div>
			<img className="h-16.25" src={ClockImage} />
		</div>
	);
};

export default Clock;
