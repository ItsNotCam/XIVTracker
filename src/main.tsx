import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './globals.css'
import Frame from './components/frame.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
		<div className={`
			flex flex-col h-screen rounded-lg overflow-hidden 
			bg-primary-100
		`}>
			<Frame />
			<App />
		</div>
  </React.StrictMode>,
)