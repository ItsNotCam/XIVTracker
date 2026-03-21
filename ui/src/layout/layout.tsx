import Header from '@ui/layout/Header/Header';
import Body from '@ui/layout/Body/Body';

const App: React.FC = () => (
	<main className="bg-custom-gray-300 h-screen grid grid-rows-[auto_1fr]">
		<Header />
		<Body />
	</main>
);

export default App;