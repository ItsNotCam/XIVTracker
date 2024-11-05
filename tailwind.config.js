/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./ui/index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
			colors: {
				"custom": {
					"frame-red": "#f5605e",
					"frame-yellow": "#fdbd35",
					"frame-green": "#28c841",
					"main-bg": "#2b2d31",
					"nav-bg": "#1f2023",
				},
			}
		},
  },
  plugins: [],
}