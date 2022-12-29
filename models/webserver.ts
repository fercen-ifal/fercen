export const isDevServer = () => {
	return process.env.NODE_ENV === "development";
};

export const isPreviewServer = () => {
	return ["preview"].includes(String(process.env.VERCEL_ENV));
};

export const getURL = () => {
	let url = process.env.WEBSERVER_URL || "https://fercen.vercel.app";

	if (isDevServer()) {
		url = "http://localhost:3000";
	}

	if (isPreviewServer()) {
		url = `https://${process.env.VERCEL_URL}`;
	}

	return url;
};
