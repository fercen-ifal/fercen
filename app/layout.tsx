import { Header } from "interface/components/Header";
import { getURL } from "models/webserver";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
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

export const metadata: Metadata = {
	title: {
		default: "Ferramenta de Controle Energético",
		template: "%s | FERCEN",
	},
	description: "Ferramenta de Controle Energético do IFAL Campus Arapiraca.",
	applicationName: "Fercen",
	referrer: "origin-when-cross-origin",
	keywords: [
		"Controle Energético",
		"Sustentabilidade",
		"Gerenciamento",
		"Instituto Federal de Alagoas",
		"IFAL",
	],
	colorScheme: "only light",
	icons: {
		icon: "/favicon.png",
	},

	openGraph: {
		title: "Ferramenta de Controle Energético",
		description: "Ferramenta de Controle Energético do IFAL Campus Arapiraca.",
		url: getURL(),
		siteName: "Fercen",
		locale: "pt-BR",
		type: "website",
	},

	twitter: {
		card: "summary_large_image",
		title: "FERCEN",
		description: "Ferramenta de Controle Energético do IFAL Campus Arapiraca.",
	},
};

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
