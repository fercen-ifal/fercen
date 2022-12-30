import type { RecoveryCode, UpdatableRecoveryCode } from "entities/RecoveryCode";

export interface IRecoveryCodesRepository {
	/**
	 * Cria um novo código de recuperação no banco de dados.
	 * O ``id`` e ``publicId`` são gerados automaticamente e retornados pela função.
	 *
	 * @param {(Omit<RecoveryCode, "id" | "publicId">)} recoveryCode Código de recuperação.
	 *
	 * @returns {Promise<[string, string]>} ``Id`` e ``publicId`` do código de recuperação.
	 */
	create(recoveryCode: Omit<RecoveryCode, "id" | "publicId">): Promise<[string, string]>;

	/**
	 * Busca um código de recuperação no banco de dados pelo ``id`` ou ``publicId``.
	 *
	 * @param {string} idOrPublicId ``Id`` ou ``publicId`` do código de recuperação.
	 * @param {?boolean} [isPublicId] Determina se a busca é por ``id`` ou ``publicId``.
	 *
	 * @returns {(Promise<RecoveryCode | null>)} Promessa do código de recuperação ou nulo se não encontrar.
	 */
	read(idOrPublicId: string, isPublicId?: boolean): Promise<RecoveryCode | null>;

	/**
	 * Atualiza um código de recuperação no banco de dados.
	 *
	 * @param {string} idOrPublicId ``Id`` ou ``publicId`` do código de recuperação.
	 * @param {UpdatableRecoveryCode} newData Objeto com os novos dados.
	 * @param {?boolean} [isPublicId] Determina se a busca é por ``id`` ou ``publicId``.
	 *
	 * @returns {(Promise<string | null>)} Promessa de ``id`` ou ``publicId``, ou nulo se não encontrar.
	 */
	update(
		idOrPublicId: string,
		newData: UpdatableRecoveryCode,
		isPublicId?: boolean
	): Promise<string | null>;

	/**
	 * Deleta um código de recuperação do banco de dados.
	 *
	 * @param {string} idOrPublicId ``Id`` ou ``publicId`` do código de recuperação.
	 * @param {?boolean} [isPublicId] Determina se a busca é por ``id`` ou ``publicId``.
	 *
	 * @returns {(Promise<string | null>)} Promessa de ``id`` ou ``publicId``, ou nulo se não encontrar.
	 */
	delete(idOrPublicId: string, isPublicId?: boolean): Promise<string | null>;
}
