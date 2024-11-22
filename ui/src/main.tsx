import ReactDOM from 'react-dom/client'
import App from '@ui/layout/layout'
import Frame from '@ui/layout/Frame/_Root'
import '@styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<div className="grid grid-rows-[auto,1fr] h-screen rounded-lg">
		<Frame />
		<App />
	</div>
)
