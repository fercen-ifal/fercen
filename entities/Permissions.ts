export const Permissions = {
	// User related
	"create:user": "create:user",
	"read:user": "read:user",
	"update:user": "update:user",
	"update:user:other": "update:user:other",
	"read:user:other": "read:user:other",
	"read:user:list": "read:user:list",

	// Session related
	"create:session": "create:session",
	"read:session": "read:session",
} as const;

export const AnonymousUserPermissions: Permission[] = ["create:user", "create:session"];

export type Permission = keyof typeof Permissions;
