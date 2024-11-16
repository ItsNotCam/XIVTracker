import { useState, useEffect, FC, useRef } from 'react';

import ClockImage from '@assets/images/etc-clock.png'
import { IpcRendererEvent } from 'electron';
import { invoke, onReceive, send } from '@electron-lib/events/eventHelpers';

const Clock: FC<{ initialTime: string }> = ({ initialTime }) => {
	const realTimeTimeout = useRef<NodeJS.Timeout | null>(null);

	const [currentTime, setCurrentTime] = useState<string>("00:00 PM");
	const [worldTime, setWorldtime] = useState<string>(initialTime);

	const updateRealTime = () => {
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

	const updateWorldTime = async (_event?: IpcRendererEvent, newTime?: string) => {
		if(newTime) {
			setWorldtime(newTime);
			console.log("updating world time to", newTime);
		} else {
			const t = await invoke("ask:time");
			setWorldtime(t);
		}
	}

	const handleConnectionChange = (_: any, connected: boolean) => {
		if(connected) {
			console.log("Clock: reconnected to server");
			updateWorldTime();
		} else {
			console.log("Clock: disconnected from server");
		}
	}

	useEffect(() => {
		updateRealTime();
		updateWorldTime();

		realTimeTimeout.current = setInterval(updateRealTime, 1000);

		const worldTimeRef = updateWorldTime;
		const onConnectionChangeRef = handleConnectionChange;

		onReceive("update:time", worldTimeRef);
		onReceive("broadcast:tcp-connected", onConnectionChangeRef);

		return () => {
			if(realTimeTimeout.current) {
				clearTimeout(realTimeTimeout.current);
				realTimeTimeout.current = null;
			}
			
			window.ipcRenderer.removeListener("update:time", worldTimeRef);
			window.ipcRenderer.removeListener("broadcast:tcp-connected", onConnectionChangeRef);
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