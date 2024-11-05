import { useEffect, useRef, useState } from 'react';
import Sidebar from './Sidebar';

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
		window.ipcRenderer.on('udp-position', (_event: any, message: any) => {
			console.log("MSG receivedL:",message);
			positionMsg.current = message;
		});
	}, []);

	useEffect(updateMessage, [updateInterval]);

	return (message === undefined) 
		? <div>Waiting for UDP message...</div> 
		: <div>{message.data.x}<br />{message.data.y}<br/>{message.data.z}</div>;
}

export default function App() {
	const [messages, setMessages] = useState<string[]>([]);

	return (
		<div className="grid grid-cols-[auto,1fr] ">
			<Sidebar />
			<div className='flex flex-row gap-4 items-center justify-between p-3'>
				<h1 className='font-bold text-2xl text-center'>
					UDP Messages
				</h1>
				<button onClick={() => setMessages([])} className='p-2 bg-custom-main-bg hover:bg-custom-main-bg-hover rounded-md'>Clear</button>
			</div>
			{messages}
		</div>
	)

	return (
		<div className='flex-grow w-full bg-custom-main-bg text-gray-200 flex flex-col'>
			<div className='flex flex-row gap-4 items-center justify-between p-3'>
				<h1 className='font-bold text-2xl text-center'>
					UDP Messages
				</h1>
				<button onClick={() => setMessages([])} className='p-2 bg-custom-main-bg hover:bg-custom-main-bg-hover rounded-md'>Clear</button>
			</div>
			{messages}
			<DataDisplay />
			{/* <div className="flex-grow overflow-auto ml-4 grid grid-cols-[7rem,auto]">
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
			</div> */}
		</div>
	);
}
