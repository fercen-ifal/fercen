/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	poweredByHeader: false,
	experimental: {
		appDir: true,
		typedRoutes: true,
	},
};

module.exports = nextConfig;
