import { Redis } from "ioredis";

export const redis = new Redis({
	host: process.env.REDIS_DB_ENDPOINT,
	port: Number(process.env.REDIS_DB_PORT || 6379),
	username: process.env.REDIS_DB_USERNAME,
	password: process.env.REDIS_DB_PASSWORD,
	db: 0,
	lazyConnect: true,
	disconnectTimeout: 10,
	maxRetriesPerRequest: 0,
	enableAutoPipelining: true,
});
