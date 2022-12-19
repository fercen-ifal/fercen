import type { Permission } from "./Permissions";

/**
 * Interface de conexão do usuário com fontes externas de autenticação.
 */
export interface UserProviderConnection {
	uid: string;
	name: string;
	email: string;
	connectedAt: FirebaseFirestore.Timestamp;
}

/**
 * Interface do usuário disponibilizada pelo banco de dados.
 */
export interface User {
	// TODO
	id: string;
	fullname: string | null;
	username: string;
	email: string;
	permissions: Permission[];
	googleProvider?: UserProviderConnection;
	microsoftProvider?: UserProviderConnection;
}

/**
 * Interface do usuário exclusiva do banco de dados.
 *
 * @see {@link User}
 */
export interface DatabaseUser extends User {
	/**
	 * Hash bcrypt da senha do usuário, existente apenas no banco de dados.
	 */
	password: string;
}

/**
 * Interface do usuário exclusiva do objeto de request da API.
 */
export interface ApiRequestUser {
	// TODO: Adjust on User interface change
	id?: string;
	username?: string;
	permissions: Permission[];
}
