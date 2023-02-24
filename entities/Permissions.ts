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

	// Electricity Bills related
	"create:electricity_bill": "create:electricity_bill",
	"update:electricity_bill": "update:electricity_bill",
} as const;

/** Labels das permissões disponíveis para uso no sistema.  */
export const PermissionsLabels = {
	// User related
	"create:user": "Criar usuário",
	"read:user": "Ler usuário",
	"update:user": "Atualizar usuário",
	"update:user:other": "Atualizar outro usuário",
	"read:user:other": "Ler outro usuário",
	"read:user:list": "Listar usuários",

	// Session related
	"create:session": "Criar sessão",
	"read:session": "Ler sessão",

	// Invite related
	"create:invite": "Criar convites",
	"read:invite": "Ler convites",

	// Electricity Bills related
	"create:electricity_bill": "Cadastrar contas de energia",
	"update:electricity_bill": "Atualizar contas de energia",
} as const;

/** Permissões padrão para usuários anônimos.  */
export const AnonymousUserPermissions = ["create:user", "create:session"] as const;

/** Tipo contendo uma das permissões existentes.  */
export type Permission = keyof typeof Permissions;
