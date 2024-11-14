import { useState, useEffect, FC, useRef } from 'react';

import ClockImage from '@assets/images/etc-clock.png'
import { IpcRendererEvent } from 'electron';

const Clock: FC<{ initialTime: string }> = ({ initialTime }) => {
	const [currentTime, setCurrentTime] = useState<string>("00:00 PM");
	const [worldTime, setCurrentWorldTime] = useState<string>(initialTime);

	const setTime = () => {
		const date = new Date();
		const minutes = date.getMinutes().toString().padStart(2, '0');
		const AMPM = date.getHours() >= 12 ? 'PM' : 'AM';

		let hours = date.getHours();
		if(hours === 0) {
			hours = 12;
		} else {
			hours = hours > 12 ? hours - 12 : hours;
		}

		const hoursStr = hours.toString().padStart(2, '0');

		setCurrentTime(`${hoursStr}:${minutes} ${AMPM}`);
	}

	const updateWorldTime = (_event: IpcRendererEvent, newTime: string) => {
		setCurrentWorldTime(newTime);
	}

	// dont need to set an interval because the entire component refreshes on change
	useEffect(() => {
		const timer = setTimeout(setTime, 1000);
		return () => {
			if(timer) {
				clearTimeout(timer);
			}
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