import Header from '@ui/layout/Header/_Root';
import Body from '@ui/layout/Body/_Root';

export default function App() {
	return (
		<main className="bg-custom-gray-300 h-screen grid grid-rows-[auto,1fr]">
			<Header />
			<Body />
		</main>
	)
}
