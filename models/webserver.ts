/**
 * Informa se o servidor é de desenvolvimento.
 *
 * @returns {boolean} Se o servidor é de desenvolvimento ou não.
 */
export const isDevServer = (): boolean => {
	return process.env.NODE_ENV === "development";
};

/**
 * Informa se o servidor é de preview.
 *
 * @returns {boolean} Se o servidor é de preview ou não.
 */
export const isPreviewServer = (): boolean => {
	return ["preview"].includes(String(process.env.VERCEL_ENV));
};

/**
 * Retorna a URL do servidor.
 *
 * @returns {string} URL do servidor.
 */
export const getURL = (): string => {
	let url = process.env.WEBSERVER_URL || "https://fercen.vercel.app";

	if (isDevServer()) {
		url = "http://localhost:3000";
	}

	if (isPreviewServer()) {
		url = `https://${process.env.VERCEL_URL}`;
	}

	return url;
};
