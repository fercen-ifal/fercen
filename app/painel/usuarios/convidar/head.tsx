import { getURL } from "models/webserver";
import React from "react";

export default async function Head() {
	const title = "Convidar administrador | FERCEN";
	const description = "Ferramenta de Controle Energético do IFAL Campus Arapiraca.";
	const url = getURL();
	const image = "";

	return (
		<>
			<title>{title}</title>
			<meta name="title" content={title} key="title" />
			<meta name="description" content={description} key="description" />
			<meta name="robots" content="index follow" key="robots" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />

			<meta property="og:site_name" content="Fercen" />
			<meta property="og:type" content="website" key="og:type" />
			<meta property="og:url" content={url} key="og:url" />
			<meta property="og:title" content={title} key="og:title" />
			<meta property="og:description" content={description} key="og:description" />
			<meta property="og:image" content={image} key="og:image" />

			<meta property="twitter:card" content="summary_large_image" key="twitter:card" />
			<meta property="twitter:url" content={url} key="twitter:url" />
			<meta property="twitter:title" content={title} key="twitter:title" />
			<meta property="twitter:description" content={description} key="twitter:description" />
			<meta property="twitter:image" content={image} key="twitter:image" />

			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<link rel="icon" href="/favicon.png" type="image/png" />
			{/* <link rel="manifest" href="/manifest.json" crossOrigin="use-credentials" /> */}
			<meta name="mobile-web-app-capable" content="yes" />
			<meta name="apple-mobile-web-app-capable" content="yes" />
			<meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
		</>
	);
}
