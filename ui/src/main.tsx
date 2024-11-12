import ReactDOM from 'react-dom/client'
import App from '@ui/App.tsx'
import Frame from '@ui/Frame.tsx'
import '@ui/globals.css'

import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	resolve: {
		alias: {
			'@ui': resolve(__dirname, 'src/components')
		}
	}
});

ReactDOM.createRoot(document.getElementById('root')!).render(
	<div className="flex flex-col h-screen rounded-lg overflow-hidden">
		<Frame />
		<App />
	</div>
)
