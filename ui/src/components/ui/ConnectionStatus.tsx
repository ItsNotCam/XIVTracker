import { useStore } from "@ui/store/store"

const ConnectionStatus: React.FC = () => {
	const { socketConnected, setShowExitDialog } = useStore();

	return (
		<div className='border-t border-[hsl(42,45%,17%)] flex flex-row items-center gap-2 mt-auto p-4'>
			<div className='relative flex items-center justify-center'>
				<div className={`absolute h-3 w-3 rounded-full animate-ping opacity-60 ${socketConnected ? 'bg-green-500' : 'bg-red-500'}`} />
				<div className={`h-2 w-2 rounded-full ${socketConnected ? 'bg-green-400' : 'bg-red-400'}`} />
			</div>
			<span className='text-sm text-custom-gray-100/50'>
				{socketConnected ? 'Connected' : 'Disconnected'}
			</span>
			<button
				className='cursor-pointer ml-auto rounded-full p-1 hover:bg-red-900/40 text-custom-gray-100/30 hover:text-red-400 transition-colors'
				title='Close application'
				onClick={() => setShowExitDialog(true)}
			>
				<svg xmlns="http://www.w3.org/2000/svg" height="1.1rem" viewBox="0 -960 960 960" width="1.1rem" fill="currentColor">
					<path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
				</svg>
			</button>
		</div>
	)
}

export default ConnectionStatus;