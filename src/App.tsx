import { useEffect, useRef, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

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

	const getJobData = () => {
		window.ipcRenderer.invoke("get-job-data").then((data: any) => {
			console.log(data);
		})
	}

	return (
		<div className="bg-custom-gray-300 h-screen">
			{/* <Sidebar /> */}
			<Header />
		</div>
	)
}
