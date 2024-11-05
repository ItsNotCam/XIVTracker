import { useEffect, useRef, useState } from 'react';

function DataDisplay() {
	const positionMsg = useRef<any>(undefined);
	const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const [message, setMessage] = useState<any>(undefined);
	const [updateInterval, setUpdateInterval] = useState<number>(25);
	
	const updateMessage = () => {
		updateIntervalRef.current && clearInterval(updateIntervalRef.current);
		updateIntervalRef.current = setInterval(() => {
			let lastMessage = positionMsg.current;
			if(lastMessage !== message) {
				setMessage(lastMessage);
			}
		}, updateInterval);
	};

  useEffect(() => {
		window.ipcRenderer.on('udp-message', (_event: any, message: any) => {
			positionMsg.current = message;
		});
	}, []);

	useEffect(updateMessage, [updateInterval]);

	return (message === undefined) 
		? <div>Waiting for UDP message...</div> 
		: <div>{message.x}<br />{message.y}<br/>{message.z}</div>;
}

export default function App() {
	const [messages, setMessages] = useState<string[]>([]);

	return (
		<div className='flex-grow w-full bg-custom-main-bg text-gray-200 flex flex-col'>
			<div className='flex flex-row gap-4 items-center justify-between p-3'>
				<h1 className='font-bold text-2xl text-center'>
					UDP Messages
				</h1>
				<button onClick={() => setMessages([])} className='p-2 bg-custom-main-bg hover:bg-custom-main-bg-hover rounded-md'>Clear</button>
			</div>
			<DataDisplay />
			<div className="flex-grow overflow-auto ml-4 grid grid-cols-[7rem,auto]">
				<div className='font-bold'>Message</div>
				<ul className='font-bold'>
					<li>Region</li>
					<li>Territory</li>
					<li>Area</li>
					<li>Sub Area</li>
					<li>Position</li>
				</ul>
				<ul>
					{messages.map((message, index) => (
						<li className='text-nowrap'>{message.length > 0 ? message : "-"}</li>
					))}
				</ul>
			</div>
		</div>
	);
}
