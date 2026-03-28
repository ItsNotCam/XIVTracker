import ReactDOM from 'react-dom/client'
import App from '@layout/layout'
import Frame from '@layout/Frame/Frame'
import '@styles/globals.css'
import { Component, ReactNode } from 'react'
import { CraftingImage, JobsImage } from './assets/images/tabs'
import Jobs from './layout/Body/Jobs/Jobs'
import RecipeSearch from './layout/Body/Recipes/Recipes'

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
		<div className="border border-blue-200 h-screen rounded-lg">
		{/* <div className="grid grid-rows-[auto_1fr] h-screen rounded-lg"> */}
			{/* <Frame /> */}
			<App />
		</div>
	</ErrorBoundary>
)
