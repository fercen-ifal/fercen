/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	poweredByHeader: false,
	experimental: {
		appDir: true,
	},
};

module.exports = nextConfig;
