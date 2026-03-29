import { useStore } from "@ui/store/store";


export const ExitDialog: React.FC = () => {
	const store = useStore();

	const onCancel = () => store.setShowExitDialog(false);
	const onConfirm = () =>  window.ipcRenderer.send('exit');

	return (
	<div className='fixed inset-0 z-50 items-center justify-center bg-black/60' style={{
		display: store.showExitDialog ? "flex" : "none"
	}}>
		<div className='bg-[hsl(36,33%,4%)] border border-[hsl(42,45%,17%)] rounded-lg shadow-2xl w-72 overflow-hidden'>
			<div className='bg-[hsl(42,43%,8%)] border-b border-[hsl(42,45%,17%)] px-5 py-3 flex items-center gap-3'>
				<svg xmlns="http://www.w3.org/2000/svg" height="1.1rem" viewBox="0 -960 960 960" width="1.1rem" className='fill-custom-text-secondary-500 shrink-0'>
					<path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
				</svg>
				<span className='font-forum text-custom-text-secondary-500 uppercase tracking-widest text-sm'>Close Application</span>
			</div>
			<div className='px-5 py-4'>
				<p className='text-custom-text-primary-300 text-sm'>Are you sure you want to close XIVTracker?</p>
			</div>
			<div className='px-5 pb-4 flex flex-row gap-2 justify-end'>
				<button
					onClick={onCancel}
					className='cursor-pointer px-4 py-1.5 text-sm rounded border border-[hsl(42,45%,17%)] text-custom-text-primary-500 hover:bg-[hsl(42,43%,9%)] hover:text-custom-text-primary-300 transition-colors'
				>
					Cancel
				</button>
				<button
					onClick={onConfirm}
					className='cursor-pointer px-4 py-1.5 text-sm rounded bg-red-900/50 border border-red-800/60 text-red-300 hover:bg-red-800/60 hover:text-red-200 transition-colors'
				>
					Close
				</button>
			</div>
		</div>
	</div>
)};
