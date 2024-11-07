import React, { useState, useEffect } from 'react';

export default function Clock() {
	const [currentTime, setCurrentTime] = useState<string>("");

	useEffect(() => {
		const timer = setInterval(() => {
			const date = new Date();
			const minutes = date.getMinutes().toString().padStart(2, '0');
			const AMPM = date.getHours() >= 12 ? 'PM' : 'AM';

			let hours = date.getHours();
			hours = hours > 12 ? hours - 12 : hours;
			const hoursStr = hours.toString().padStart(2, '0');

			setCurrentTime(`${hoursStr}:${minutes} ${AMPM}`);
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	return (
		<div className="bg-custom-gray-500 grid grid-cols-[1fr,auto] h-fit mb-2">
			<div className='flex flex-col justify-center items-end'>
				{/* <h1 className="text-2xl">08:56 AM</h1> */}
				<h1 className="text-2xl">{currentTime}</h1>
				<h2 className="text-lg">12:35 PM</h2>
			</div>
			<img className="h-[65px]" src="/images/etc-clock.png" />
		</div>
	);
};