import Header from '@ui/layout/Header/_Root';
import Body from '@ui/layout/Body/_Root';

const App: React.FC = () => {
	return (
		<main className="bg-custom-gray-300 h-screen grid grid-rows-[auto,1fr]">
			<Header />
			<Body />
		</main>
	)
}

export default App;