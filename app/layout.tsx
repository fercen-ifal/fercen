import { Poppins } from "@next/font/google";

import { Header } from "interface/components/Header";
import React from "react";
import "react-toastify/dist/ReactToastify.min.css";

import { Toasts } from "./Toasts";
import "./globals.css";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
	style: ["normal", "italic"],
	variable: "--font-poppins",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pt-br" dir="ltr">
			<body className={`${poppins.variable} font-sans`}>
				<Header />
				{children}
				<Toasts />
			</body>
		</html>
	);
}
