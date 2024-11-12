import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Frame from './Frame.tsx'
import './globals.css'
import React from 'react'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<div className="flex flex-col h-screen rounded-lg overflow-hidden">
		<Frame />
		<App />
	</div>
)
