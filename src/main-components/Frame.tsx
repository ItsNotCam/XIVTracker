import ConnectionStatus from "../components/connection-display";
import GilDisplay from "../components/gil-display";

export default function Frame() {
	const close = () => {
		window.ipcRenderer.send("exit");
	}

	const minimize = () => {
		window.ipcRenderer.send("minimize");
	}

	const maximize = () => {
		window.ipcRenderer.send("maximize");
	}

	return (
		<div className={`bg-custom-gray-700 w-full shadow-lg flex flex-row justify-between items-center header py-2 h-8 px-3 `}>
			<ul className="grid grid-cols-3 gap-2 flex-grow-0 items-center">
				<li className="header-menu-button bg-custom-frame-red">
					<svg className="fill-custom-frame-red hover:fill-black transition-[fill]" onClick={close}
						xmlns="http://www.w3.org/2000/svg" 
						height="100%" 
						viewBox="0 -960 960 960" 
						width="100%">
							<path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
					</svg>
				</li>
				<li className="header-menu-button bg-custom-frame-yellow">
					<svg className="fill-custom-frame-yellow hover:fill-black transition-[fill]" onClick={minimize}
						xmlns="http://www.w3.org/2000/svg" 
						height="100%" 
						viewBox="0 -960 960 960" 
						width="100%">
							<path d="M200-440v-80h560v80H200Z"/>
					</svg>
				</li>
				<li className="header-menu-button bg-custom-frame-green rotate-45 object-center">
					<svg className="fill-custom-frame-green hover:fill-black transition-[fill]" onClick={maximize}
						xmlns="http://www.w3.org/2000/svg" 
						height="100%" 
						viewBox="0 -960 960 960" 
						width="100%">
							<path d="M480-120 300-300l58-58 122 122 122-122 58 58-180 180ZM358-598l-58-58 180-180 180 180-58 58-122-122-122 122Z"/>
					</svg>
				</li>
			</ul>
			{/* <h1 className="text-white text-xl">XIV TRACKER</h1> */}
			<div className="flex flex-row items-center gap-2">
				<GilDisplay />
				<ConnectionStatus />
			</div>
		</div>
	)
}