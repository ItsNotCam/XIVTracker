import ReactDOM from 'react-dom/client'
import App from '@ui/layout/Layout'
import '@styles/globals.css'
import { Component, ReactNode } from 'react'
import { ExitDialog } from './components/ui/ExitDialog'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
	state = { error: null }
	static getDerivedStateFromError(error: Error) { return { error } }
	render() {
		if (this.state.error) return <pre style={{ color: 'red', padding: 20 }}>{(this.state.error as Error).message}</pre>
		return this.props.children
	}
}


ReactDOM.createRoot(document.getElementById('root')!).render(
	<ErrorBoundary>
		<ExitDialog />
		{/* <div className="border h-screen rounded-lg"> */}
			{/* <div className='header h-5 w-full shrink-0' /> */}
			<App />
		{/* </div> */}
	</ErrorBoundary>
)
