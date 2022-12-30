import { InternalServerError } from "errors/index";
import { firestore } from "models/database";
import { v4 as uuid } from "uuid";
import retry from "async-retry";
import { nanoid } from "nanoid";
import type { IRecoveryCodesRepository } from "repositories/IRecoveryCodesRepository";
import type { RecoveryCode, UpdatableRecoveryCode } from "entities/RecoveryCode";

/**
 * Classe que implementa o repositório de códigos de recuperação do Firestore.
 *
 * @class FirebaseRecoveryCodesRepository
 * @typedef {FirebaseRecoveryCodesRepository}
 * @implements {IRecoveryCodesRepository}
 */
export class FirebaseRecoveryCodesRepository implements IRecoveryCodesRepository {
	private readonly col: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
	private readonly retryOpts: retry.Options;

	constructor() {
		this.col = firestore.collection("recovery_codes");
		this.retryOpts = { retries: 3, minTimeout: 100, maxTimeout: 200 };
	}

	async create(recoveryCode: Omit<RecoveryCode, "id" | "publicId">): Promise<[string, string]> {
		return await retry(async () => {
			try {
				const databaseRecoveryCode: RecoveryCode = {
					id: uuid(),
					publicId: nanoid(8),
					...recoveryCode,
				};
				this.col.doc(databaseRecoveryCode.id).create(databaseRecoveryCode);

				return [databaseRecoveryCode.id, databaseRecoveryCode.publicId];
			} catch (err) {
				throw new InternalServerError({
					message: "Houve um erro ao tentar criar seu código de recuperação.",
					errorLocationCode: "REPOS:RECOVERY_CODES:CREATE_FAILURE",
					stack: new Error().stack,
				});
			}
		}, this.retryOpts);
	}

	async read(
		idOrPublicId: string,
		isPublicId?: boolean | undefined
	): Promise<RecoveryCode | null> {
		return await retry(async () => {
			try {
				let data: RecoveryCode | undefined;

				if (isPublicId) {
					const recoveryCode = await this.col
						.where("publicId", "==", idOrPublicId)
						.limit(1)
						.get();
					if (
						recoveryCode.empty ||
						!recoveryCode.docs[0].exists ||
						!recoveryCode.docs[0].data()
					)
						return null;
					const recoveryCodeData = recoveryCode.docs[0].data() as RecoveryCode;
					data = recoveryCodeData;
				} else {
					const recoveryCode = await this.col.doc(idOrPublicId).get();
					const recoveryCodeData = recoveryCode.data() as RecoveryCode | undefined;
					if (!recoveryCode.exists || !recoveryCodeData) return null;
					data = recoveryCodeData;
				}

				return data;
			} catch (err) {
				throw new InternalServerError({
					message: "Houve um erro ao tentar ler o código de recuperação.",
					errorLocationCode: "REPOS:RECOVERY_CODES:READ_FAILURE",
					stack: new Error().stack,
				});
			}
		}, this.retryOpts);
	}

	async update(
		idOrPublicId: string,
		newData: UpdatableRecoveryCode,
		isPublicId?: boolean | undefined
	): Promise<string | null> {
		return await retry(async () => {
			try {
				if (isPublicId) {
					const recoveryCode = await this.col
						.where("publicId", "==", idOrPublicId)
						.limit(1)
						.get();
					if (
						recoveryCode.empty ||
						!recoveryCode.docs[0].exists ||
						!recoveryCode.docs[0].data()
					)
						return null;
					const recoveryCodeData = recoveryCode.docs[0].data() as RecoveryCode;

					await this.col.doc(recoveryCodeData.id).update({ ...newData });
					return recoveryCodeData.id;
				}

				await this.col.doc(idOrPublicId).update({ ...newData });
				return idOrPublicId;
			} catch (err) {
				throw new InternalServerError({
					message: "Houve um erro ao tentar atualizar o código de recuperação.",
					errorLocationCode: "REPOS:RECOVERY_CODES:UPDATE_FAILURE",
					stack: new Error().stack,
				});
			}
		}, this.retryOpts);
	}

	async delete(idOrPublicId: string, isPublicId?: boolean | undefined): Promise<string | null> {
		return await retry(async () => {
			try {
				if (isPublicId) {
					const recoveryCode = await this.col
						.where("publicId", "==", idOrPublicId)
						.limit(1)
						.get();
					if (
						recoveryCode.empty ||
						!recoveryCode.docs[0].exists ||
						!recoveryCode.docs[0].data()
					)
						return null;
					const recoveryCodeData = recoveryCode.docs[0].data() as RecoveryCode;

					await this.col.doc(recoveryCodeData.id).delete();
					return recoveryCodeData.id;
				}

				await this.col.doc(idOrPublicId).delete();
				return idOrPublicId;
			} catch (err) {
				throw new InternalServerError({
					message: "Houve um erro ao tentar deletar o código de recuperação.",
					errorLocationCode: "REPOS:RECOVERY_CODES:DELETE_FAILURE",
					stack: new Error().stack,
				});
			}
		}, this.retryOpts);
	}
}
