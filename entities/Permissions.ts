/** Permissões disponíveis para uso no sistema.  */
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

	// Invite related
	"create:invite": "create:invite",
	"read:invite": "read:invite",
} as const;

/** Permissões padrão para usuários anônimos.  */
export const AnonymousUserPermissions = ["create:user", "create:session"] as const;

/** Tipo contendo uma das permissões existentes.  */
export type Permission = keyof typeof Permissions;
