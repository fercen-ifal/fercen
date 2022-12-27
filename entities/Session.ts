import type { Permission } from "./Permissions";
import type { User } from "./User";

export interface AnonymousSession {
	type: "anonymous";
	permissions: Permission[];
}

export interface UserSession extends User {
	type: "user";
}

export type Session = AnonymousSession | UserSession;
