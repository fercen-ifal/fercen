import type { DatabaseUser, UpdatableUser, User } from "entities/User";

/** Interface do repositório de usuários.  */
export interface IUsersRepository {
	/**
	 * Cria um novo usuário no banco de dados.
	 * O ``id`` do usuário é gerado e retornado pela função.
	 *
	 * @param {Omit<DatabaseUser, "id">} user Dados do usuário.
	 *
	 * @returns {Promise<string>} Promessa de ``id``.
	 */
	create(user: Omit<DatabaseUser, "id">): Promise<string>;

	/**
	 * Busca um usuário no banco de dados por ``id`` ou ``email``.
	 *
	 * @param {string} userIdOrEmail ``Id`` ou ``email`` do usuário.
	 * @param {?boolean} [isEmail] Determina se a busca é por ``email`` ou não.
	 *
	 * @returns {(Promise<User | null>)} Promessa de usuário ou nulo se não encontrar.
	 */
	read(userIdOrEmail: string, isEmail?: boolean): Promise<User | null>;

	/**
	 * Busca um usuário no banco de dados por ``username``.
	 *
	 * @param {string} username Username do usuário.
	 *
	 * @returns {(Promise<User | null>)} Promessa de usuário ou nulo se não encontrar.
	 */
	readByUsername(username: string): Promise<User | null>;

	/**
	 * Busca todos os usuários no banco de dados.
	 *
	 * @returns {Promise<User[]>} Promessa de uma lista de usuários.
	 */
	readAll(): Promise<User[]>;

	/**
	 * Atualiza um usuário no banco de dados.
	 *
	 * @param {string} userIdOrEmail ``Id`` ou ``email`` do usuário.
	 * @param {UpdatableUser} newData Objeto com os novos dados.
	 * @param {?boolean} [isEmail] Determina se a busca é por ``email`` ou não.
	 *
	 * @returns {(Promise<string | null>)} Promessa de ``id`` ou nulo se não encontrar.
	 */
	update(
		userIdOrEmail: string,
		newData: UpdatableUser,
		isEmail?: boolean
	): Promise<string | null>;

	/**
	 * Deleta um usuário do banco de dados.
	 *
	 * @param {string} userIdOrEmail ``Id`` ou ``email`` do usuário.
	 * @param {?boolean} [isEmail] Determina se a busca é por ``email`` ou não.
	 *
	 * @returns {(Promise<string | null>)} Promessa de ``id`` ou nulo se não encontrar.
	 */
	delete(userIdOrEmail: string, isEmail?: boolean): Promise<string | null>;

	/**
	 * Verifica as credenciais do usuário.
	 *
	 * @param {string} username Username do usuário.
	 * @param {string} password Senha do usuário.
	 *
	 * @returns {(Promise<[boolean, User | null]>)} Promessa de lista contendo resultado da validação e usuário ou nulo.
	 */
	validateCredentials(username: string, password: string): Promise<[boolean, User | null]>;
}
