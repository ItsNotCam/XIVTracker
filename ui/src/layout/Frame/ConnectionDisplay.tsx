import { invoke, onReceive, unregister } from '@lib/eventHelpers';
import { useState, useEffect, useRef } from 'react';

export default function ConnectionStatus(): JSX.Element {
	const [isConnected, setIsConnected] = useState(false);
	const connectionTimeout = useRef<NodeJS.Timeout | null>(null);

	const handleTcpConnected = (_event: Electron.Event, connected: boolean) => {
		setIsConnected(connected);
	}

	useEffect(() => {
		onReceive("broadcast:tcp-connected", handleTcpConnected);
		invoke("ask:tcp-connected").then((connected: boolean) => {
			setIsConnected(connected);
		});

		return () => {
			const { ipcRenderer } = window;
			unregister("broadcast:tcp-connected", ipcRenderer, handleTcpConnected);
		}
	}, []);

	useEffect(() => {
		if(connectionTimeout.current) {
			clearTimeout(connectionTimeout.current);
		}
	}, [isConnected]);

	return (
		<span title={`TCP ${isConnected ? "Connected" : "Disconnected"}`} className="py-4">
			<svg 
				className={isConnected ? 'fill-custom-frame-green' : 'fill-custom-frame-red'} 
				xmlns="http://www.w3.org/2000/svg" 
				width="24px" 
				height="24px" 
				viewBox="0 -960 960 960" 
			>
					<path d="M480-120q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM254-346l-84-86q59-59 138.5-93.5T480-560q92 0 171.5 35T790-430l-84 84q-44-44-102-69t-124-25q-66 0-124 25t-102 69ZM84-516 0-600q92-94 215-147t265-53q142 0 265 53t215 147l-84 84q-77-77-178.5-120.5T480-680q-116 0-217.5 43.5T84-516Z"/>
				</svg>
		</span>
	);
}
