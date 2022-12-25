import type { IronSessionOptions } from "iron-session";
import type { ApiRequestUser } from "entities/User";

export const sessionOptions: IronSessionOptions = {
	cookieName: "fercen-session",
	password: process.env.COOKIE_SECRET as string,
	cookieOptions: {
		secure: process.env.NODE_ENV === "production",
		httpOnly: true,
	},
};

declare module "iron-session" {
	interface IronSessionData {
		user?: ApiRequestUser;
	}
}
