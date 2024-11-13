import { useState, useEffect } from 'react';

import ClockImage from '@assets/images/etc-clock.png'
import { IpcRendererEvent } from 'electron';

export default function Clock() {
	const [currentTime, setCurrentTime] = useState<string>("00:00 PM");
	const [worldTime, setCurrentWorldTime] = useState<string>("00:00 AM");

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
		
		const timer = setInterval(setTime, 1000);
		return timer;
	}

	const updateWorldTime = (_event: IpcRendererEvent, newTime: string) => {
		setCurrentWorldTime(newTime);
	}

	useEffect(() => {
		const timer = setTime();

		window.ipcRenderer.on("update-world-time", updateWorldTime);


		return () => {
			clearInterval(timer);
			window.ipcRenderer.removeListener("update-world-time", updateWorldTime);
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