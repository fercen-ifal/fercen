import type { Invite, UpdatableInvite } from "entities/Invite";

/** Interface do repositório de convites.  */
export interface IInvitesRepository {
	/**
	 * Cria um novo convite no banco de dados.
	 * O ``id`` e ``publicId`` são gerados automaticamente e retornados pela função.
	 *
	 * @param {(Omit<Invite, "id" | "publicId">)} invite Convite.
	 *
	 * @returns {Promise<[string, string]>} ``Id`` e ``publicId`` do convite.
	 */
	create(invite: Omit<Invite, "id" | "publicId">): Promise<[string, string]>;

	/**
	 * Busca um convite no banco de dados pelo ``id`` ou ``publicId``.
	 *
	 * @param {string} idOrPublicId ``Id`` ou ``publicId`` do convite.
	 * @param {?boolean} [isPublicId] Determina se a busca é por ``id`` ou ``publicId``.
	 *
	 * @returns {(Promise<Invite | null>)} Promessa do convite ou nulo se não encontrar.
	 */
	read(idOrPublicId: string, isPublicId?: boolean): Promise<Invite | null>;

	/**
	 * Busca todos os convites no banco de dados.
	 *
	 * @returns {Promise<Invite[]>} Promessa de uma lista de convites.
	 */
	readAll(): Promise<Invite[]>;

	/**
	 * Atualiza um convite no banco de dados.
	 *
	 * @param {string} idOrPublicId ``Id`` ou ``publicId`` do convite.
	 * @param {UpdatableInvite} newData Objeto com os novos dados.
	 * @param {?boolean} [isPublicId] Determina se a busca é por ``id`` ou ``publicId``.
	 *
	 * @returns {(Promise<string | null>)} Promessa de ``id`` ou ``publicId``, ou nulo se não encontrar.
	 */
	update(
		idOrPublicId: string,
		newData: UpdatableInvite,
		isPublicId?: boolean
	): Promise<string | null>;

	/**
	 * Deleta um convite do banco de dados.
	 *
	 * @param {string} idOrPublicId ``Id`` ou ``publicId`` do convite.
	 * @param {?boolean} [isPublicId] Determina se a busca é por ``id`` ou ``publicId``.
	 *
	 * @returns {(Promise<string | null>)} Promessa de ``id`` ou ``publicId``, ou nulo se não encontrar.
	 */
	delete(idOrPublicId: string, isPublicId?: boolean): Promise<string | null>;
}
