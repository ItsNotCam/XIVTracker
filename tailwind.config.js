/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./ui/index.html",
    "./ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
			colors: {
				custom: {
					frame: {
						red: "#f5605e",
						yellow: "#fdbd35",
						green: "#28c841",
					},
					gray: {
						100: "#ffffff",
						200: "#494949",
						300: "#343434",
						500: "#292929",
						700: "#1e201e",
						900: "#1b1b1b"
					},
					text: {
						primary: {
							100: "#ffffff",
							300: "#b4b4b4",
							500: "#888888"
						},
						secondary: {
							100: "#fff3cc",
							300: "#ffe3b4",
							500: "#d6ba70"
						}
					}
				},
			},
			backgroundImage: {
				"gradient-xp-vertical": "linear-gradient(90deg, #A87D30 0%, #F6DAAF 32%, #F3BC61 56%, #F1AD3C 69%, #8E7424 100%)",
				"gradient-xp-horizontal": "linear-gradient(180deg, #A87D30 0%, #F6DAAF 32%, #F3BC61 56%, #F1AD3C 69%, #8E7424 100%)"
			},
			textShadow: {
				two: '0 0 2px #FFD446',
			},
		},
  },
  plugins: [],
}
