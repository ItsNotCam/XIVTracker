import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './globals.css'
import Navbar from './Navbar.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
		<div className='flex flex-col h-screen border-[1.65px] border-gray-500 rounded-lg overflow-hidden bg-white'>
			<Navbar />
			<App />
		</div>
  </React.StrictMode>,
)

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
