import type { Permission } from "./Permissions";

export interface User {
	// TODO
}

export interface ApiRequestUser {
	// TODO: Adjust on User interface change
	id?: string;
	username?: string;
	permissions: Permission[];
}
