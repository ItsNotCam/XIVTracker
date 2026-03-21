import { useState, useEffect, useRef } from 'react';
import { invoke, addListener, removeListener } from '@ui/util/util';

import ClockImage from '@assets/images/etc-clock.png';

const Clock: React.FC = () => {
	const realTimeInterval = useRef<NodeJS.Timeout | null>(null);

	const [currentTime, setCurrentTime] = useState<string>("00:00 PM");
	const [worldTime, setWorldtime] = useState<string>("00:00 PM");

	const updateRealTime = () => {
		const date = new Date();
		const minutes = date.getMinutes().toString().padStart(2, '0');
		const AMPM = date.getHours() >= 12 ? 'PM' : 'AM';

		let hours = date.getHours();
		if (hours === 0) {
			hours = 12;
		} else {
			hours = hours > 12 ? hours - 12 : hours;
		}

		const hoursStr = hours.toString().padStart(2, '0');
		setCurrentTime(`${hoursStr}:${minutes} ${AMPM}`);
	}

	const updateWorldTime = async () => {
		const newTime: TimeModel | undefined = await invoke("time.get");
		setWorldtime((oldTime: string) => newTime?.eorzea?.toUpperCase() ?? oldTime);
	}

	const handleConnectionChange = (_: any, connected: boolean) => {
		if (connected) {
			updateWorldTime();
		}
	}

	useEffect(() => {
		updateRealTime();
		updateWorldTime();

		realTimeInterval.current = setInterval(updateRealTime, 1000);

		addListener(updateWorldTime, "time.changed");
		addListener(handleConnectionChange, "connection.changed");
		addListener(updateWorldTime, "loggedIn");

		return () => {
			if (realTimeInterval.current) {
				clearTimeout(realTimeInterval.current);
			}

			removeListener(updateWorldTime, "time.changed");
			removeListener(handleConnectionChange, "connection.changed");
			removeListener(handleConnectionChange, "loggedIn");
		};
	}, []);

	return (
		<div className="grid grid-cols-[1fr,auto] h-fit mb-2">
			<div className='flex flex-col justify-center items-end'>
				<h1 className="text-2xl">{currentTime}</h1>
				<h2 className="text-lg">{worldTime}</h2>
			</div>
			<img className="h-[65px]" src={ClockImage} />
		</div>
	);
};

export default Clock;
