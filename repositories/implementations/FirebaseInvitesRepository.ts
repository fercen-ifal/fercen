import retry from "async-retry";
import type { Invite, UpdatableInvite } from "entities/Invite";
import { InternalServerError } from "errors/index";
import { firestore } from "models/database";
import { nanoid } from "nanoid";
import type { IInvitesRepository } from "repositories/IInvitesRepository";
import { v4 as uuid } from "uuid";

/**
 * Classe que implementa o repositório de convites do Firestore.
 *
 * @class FirebaseInvitesRepository
 * @typedef {FirebaseInvitesRepository}
 * @implements {IInvitesRepository}
 */
export class FirebaseInvitesRepository implements IInvitesRepository {
	private readonly col: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
	private readonly retryOpts: retry.Options;

	constructor() {
		this.col = firestore.collection("invites");
		this.retryOpts = { retries: 3, minTimeout: 100, maxTimeout: 200 };
	}

	async create(invite: Omit<Invite, "id" | "publicId">): Promise<[string, string]> {
		return await retry(async () => {
			try {
				const databaseInvite: Invite = {
					id: uuid(),
					publicId: nanoid(7),
					...invite,
				};
				this.col.doc(databaseInvite.id).create(databaseInvite);

				return [databaseInvite.id, databaseInvite.publicId];
			} catch (err) {
				throw new InternalServerError({
					message: "Houve um erro ao tentar criar seu convite.",
					errorLocationCode: "REPOS:INVITES:CREATE_FAILURE",
					stack: new Error().stack,
				});
			}
		}, this.retryOpts);
	}

	async read(idOrPublicId: string, isPublicId?: boolean | undefined): Promise<Invite | null> {
		return await retry(async () => {
			try {
				let data: Invite | undefined;

				if (isPublicId) {
					const invite = await this.col
						.where("publicId", "==", idOrPublicId)
						.limit(1)
						.get();
					if (invite.empty || !invite.docs[0].exists || !invite.docs[0].data())
						return null;
					const inviteData = invite.docs[0].data() as Invite;
					data = inviteData;
				} else {
					const invite = await this.col.doc(idOrPublicId).get();
					const inviteData = invite.data() as Invite | undefined;
					if (!invite.exists || !inviteData) return null;
					data = inviteData;
				}

				return data;
			} catch (err) {
				throw new InternalServerError({
					message: "Houve um erro ao tentar ler o convite.",
					errorLocationCode: "REPOS:INVITES:READ_FAILURE",
					stack: new Error().stack,
				});
			}
		}, this.retryOpts);
	}

	async readByTarget(targetEmail: string): Promise<Invite | null> {
		return await retry(async () => {
			try {
				const invite = await this.col
					.where("targetEmail", "==", targetEmail)
					.limit(1)
					.get();
				if (invite.empty || !invite.docs[0].exists || !invite.docs[0].data()) return null;
				const data = invite.docs[0].data() as Invite;

				return data;
			} catch (err) {
				throw new InternalServerError({
					message: "Houve um erro ao tentar ler o convite pelo email.",
					errorLocationCode: "REPOS:INVITES:READBYTARGETEMAIL_FAILURE",
					stack: new Error().stack,
				});
			}
		}, this.retryOpts);
	}

	async readAll(): Promise<Invite[]> {
		try {
			let invites: Invite[] = [];
			const databaseInvites = await this.col.get();

			for (const invite of databaseInvites.docs) {
				const data = invite.data() as Invite | undefined;
				if (!data) continue;
				invites.push(data);
			}

			return invites;
		} catch (err) {
			throw new InternalServerError({
				message: "Não foi possível ler todos os convites.",
				errorLocationCode: "REPOS:INVITES:READALL_FAILURE",
				stack: new Error().stack,
			});
		}
	}

	async update(
		idOrPublicId: string,
		newData: UpdatableInvite,
		isPublicId?: boolean | undefined
	): Promise<string | null> {
		return await retry(async () => {
			try {
				if (isPublicId) {
					const invite = await this.col
						.where("publicId", "==", idOrPublicId)
						.limit(1)
						.get();
					if (invite.empty || !invite.docs[0].exists || !invite.docs[0].data())
						return null;
					const inviteData = invite.docs[0].data() as Invite;

					await this.col.doc(inviteData.id).update({ ...newData });
					return inviteData.id;
				}

				await this.col.doc(idOrPublicId).update({ ...newData });
				return idOrPublicId;
			} catch (err) {
				throw new InternalServerError({
					message: "Houve um erro ao tentar atualizar o convite.",
					errorLocationCode: "REPOS:INVITES:UPDATE_FAILURE",
					stack: new Error().stack,
				});
			}
		}, this.retryOpts);
	}

	async delete(idOrPublicId: string, isPublicId?: boolean | undefined): Promise<string | null> {
		return await retry(async () => {
			try {
				if (isPublicId) {
					const invite = await this.col
						.where("publicId", "==", idOrPublicId)
						.limit(1)
						.get();
					if (invite.empty || !invite.docs[0].exists || !invite.docs[0].data())
						return null;
					const inviteData = invite.docs[0].data() as Invite;

					await this.col.doc(inviteData.id).delete();
					return inviteData.id;
				}

				await this.col.doc(idOrPublicId).delete();
				return idOrPublicId;
			} catch (err) {
				throw new InternalServerError({
					message: "Houve um erro ao tentar deletar o convite.",
					errorLocationCode: "REPOS:INVITES:DELETE_FAILURE",
					stack: new Error().stack,
				});
			}
		}, this.retryOpts);
	}
}
