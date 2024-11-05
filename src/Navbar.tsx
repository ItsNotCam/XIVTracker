import { useState } from "react";

export default function Navbar() {
	const [minimized, setMinimized] = useState<boolean>(false);

	const close = () => {
		window.close();
	}

	return (
		<div className={`
			bg-[#1e1f22] backdrop-blur-lg ${minimized ? "w-[68px]" : "w-[200px]"} 
			relative flex transition-[width,padding] shadow-lg
		`}>
			<ul className="flex flex-row p-3 gap-2 z-10 flex-grow-0 h-fit w-full header">
				<li className="cursor-pointer w-3 h-3 bg-custom-frame-red rounded-full relative">
					<svg className="fill-custom-frame-red hover:fill-black transition=[fill]" onClick={close}
						xmlns="http://www.w3.org/2000/svg" 
						height="0.75rem" 
						viewBox="0 -960 960 960" 
						width="0.75rem">
							<path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
					</svg>
				</li>
				<li className="cursor-pointer w-3 h-3 bg-custom-frame-yellow rounded-full relative">
					<svg className="fill-custom-frame-yellow hover:fill-black transition=[fill]" 
						xmlns="http://www.w3.org/2000/svg" 
						height="0.75rem" 
						viewBox="0 -960 960 960" 
						width="0.75rem">
							<path d="M200-440v-80h560v80H200Z"/>
					</svg>
				</li>
				<li className="cursor-pointer w-3 h-3 bg-custom-frame-green rounded-full relative rotate-45 object-center">
					<svg className="fill-custom-frame-green hover:fill-black transition=[fill]" 
						xmlns="http://www.w3.org/2000/svg" 
						height="0.75rem" 
						viewBox="0 -960 960 960" 
						width="0.75rem">
							<path d="M480-120 300-300l58-58 122 122 122-122 58 58-180 180ZM358-598l-58-58 180-180 180 180-58 58-122-122-122 122Z"/>
					</svg>
				</li>
			</ul>
		</div>
	)
}