import React from "react";
import "./globals.css";
import { Poppins } from "@next/font/google";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
	variable: "--font-poppins",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pt-br" dir="ltr">
			<body className={`${poppins.variable} font-sans`}>{children}</body>
		</html>
	);
}
