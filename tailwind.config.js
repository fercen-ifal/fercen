const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./app/**/*.{ts,tsx}", "./interface/components/**/*.{ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--font-poppins)", ...fontFamily.sans],
			},
			colors: {
				primary: {
					main: "#9FE3BA",
					dark: "#2DCE8A",
					darker: "#1EB575",
				},
				alt: {
					red: "#DB4C3F",
					blue: "#2C75E9",
				},
			},
		},
	},
	plugins: [],
};
