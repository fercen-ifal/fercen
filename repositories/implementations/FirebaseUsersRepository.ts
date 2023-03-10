import retry from "async-retry";
import { compare } from "bcrypt";
import type { DatabaseUser, User, UpdatableUser } from "entities/User";
import { InternalServerError } from "errors/index";
import { firestore as FirebaseFirestore } from "firebase-admin";
import { firestore } from "models/database";
import type { IUsersRepository } from "repositories/IUsersRepository";
import { v4 as uuid } from "uuid";

/**
 * Classe que implementa o repositório de usuários do Firestore.
 *
 * @class FirebaseUsersRepository
 * @typedef {FirebaseUsersRepository}
 * @implements {IUsersRepository}
 */
export class FirebaseUsersRepository implements IUsersRepository {
	private readonly col: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
	private readonly retryOpts: retry.Options;

	constructor() {
		this.col = firestore.collection("users");
		this.retryOpts = { retries: 3, minTimeout: 100, maxTimeout: 200 };
	}

	async create(user: Omit<DatabaseUser, "id">): Promise<string> {
		return await retry(async () => {
			try {
				if (user.googleProvider) {
					user.googleProvider.connectedAt = FirebaseFirestore.Timestamp.now();
				}

				if (user.microsoftProvider) {
					user.microsoftProvider.connectedAt = FirebaseFirestore.Timestamp.now();
				}

				const databaseUser: DatabaseUser = {
					id: uuid(),
					...user,
				};
				this.col.doc(databaseUser.id).create(databaseUser);

				return databaseUser.id;
			} catch (err) {
				throw new InternalServerError({
					message: "Houve um erro ao tentar criar seu usuário.",
					errorLocationCode: "REPOS:USERS:CREATE_FAILURE",
					stack: new Error().stack,
				});
			}
		}, this.retryOpts);
	}

	async read(userIdOrEmail: string, isEmail?: boolean | undefined): Promise<User | null> {
		return await retry<Promise<User | null>>(async () => {
			try {
				let data: DatabaseUser | undefined;

				if (isEmail) {
					const user = await this.col.where("email", "==", userIdOrEmail).limit(1).get();
					if (user.empty || !user.docs[0].exists || !user.docs[0].data()) return null;
					const userData = user.docs[0].data() as DatabaseUser;
					data = userData;
				} else {
					const user = await this.col.doc(userIdOrEmail).get();
					const userData = user.data() as DatabaseUser | undefined;
					if (!user.exists || !userData) return null;
					data = userData;
				}

				const { password, ...keys } = data;
				const publicUser: User = keys;
				return publicUser;
			} catch (err) {
				throw new InternalServerError({
					message: "Houve um erro ao tentar ler o usuário.",
					errorLocationCode: "REPOS:USERS:READ_FAILURE",
					stack: new Error().stack,
				});
			}
		}, this.retryOpts);
	}

	async readAll(): Promise<User[]> {
		try {
			let users: User[] = [];
			const databaseUsers = await this.col.get();

			for (const user of databaseUsers.docs) {
				if (!user.data()) continue;
				const { password, ...data } = user.data() as DatabaseUser;
				users.push(data);
			}

			return users;
		} catch (err) {
			throw new InternalServerError({
				message: "Não foi possível ler todos os usuários.",
				errorLocationCode: "REPOS:USERS:READALL_FAILURE",
				stack: new Error().stack,
			});
		}
	}

	async readByUsername(username: string): Promise<User | null> {
		return await retry(async () => {
			try {
				const user = await this.col.where("username", "==", username).limit(1).get();
				if (user.empty || !user.docs[0].exists || !user.docs[0].data()) return null;
				const { password, ...data } = user.docs[0].data() as DatabaseUser;

				return data;
			} catch (err) {
				throw new InternalServerError({
					message: "Não foi possível ler o usuário.",
					errorLocationCode: "REPOS:USERS:READBYUSERNAME_FAILURE",
					stack: new Error().stack,
				});
			}
		}, this.retryOpts);
	}

	async readByGoogleEmail(googleEmail: string): Promise<User | null> {
		return await retry(async () => {
			try {
				const user = await this.col
					.where("googleProvider.email", "==", googleEmail)
					.limit(1)
					.get();
				if (user.empty || !user.docs[0].exists || !user.docs[0].data()) return null;
				const { password, ...data } = user.docs[0].data() as DatabaseUser;

				return data;
			} catch (err) {
				throw new InternalServerError({
					message: "Não foi possível ler o usuário.",
					errorLocationCode: "REPOS:USERS:READBYGOOGLEEMAIL_FAILURE",
					stack: new Error().stack,
				});
			}
		}, this.retryOpts);
	}

	async update(
		userIdOrEmail: string,
		newData: UpdatableUser,
		isEmail?: boolean | undefined
	): Promise<string | null> {
		return await retry(async () => {
			try {
				if (isEmail) {
					const user = await this.col.where("email", "==", userIdOrEmail).limit(1).get();
					if (user.empty || !user.docs[0].exists || !user.docs[0].data()) return null;
					const userData = user.docs[0].data() as DatabaseUser;

					await this.col.doc(userData.id).update(JSON.parse(JSON.stringify(newData)));
					return userData.id;
				}

				await this.col.doc(userIdOrEmail).update(JSON.parse(JSON.stringify(newData)));
				return userIdOrEmail;
			} catch (err) {
				throw new InternalServerError({
					message: "Houve um erro ao tentar atualizar o usuário.",
					errorLocationCode: "REPOS:USERS:UPDATE_FAILURE",
					stack: new Error().stack,
				});
			}
		}, this.retryOpts);
	}

	async delete(userIdOrEmail: string, isEmail?: boolean | undefined): Promise<string | null> {
		return await retry(async () => {
			try {
				if (isEmail) {
					const user = await this.col.where("email", "==", userIdOrEmail).limit(1).get();
					if (user.empty || !user.docs[0].exists || !user.docs[0].data()) return null;
					const userData = user.docs[0].data() as DatabaseUser;

					await this.col.doc(userData.id).delete();
					return userData.id;
				}

				await this.col.doc(userIdOrEmail).delete();
				return userIdOrEmail;
			} catch (err) {
				throw new InternalServerError({
					message: "Houve um erro ao tentar deletar o usuário.",
					errorLocationCode: "REPOS:USERS:DELETE_FAILURE",
					stack: new Error().stack,
				});
			}
		}, this.retryOpts);
	}

	async validateCredentials(
		username: string,
		userPassword: string
	): Promise<[boolean, User | null]> {
		return await retry(async () => {
			try {
				const user = await this.col.where("username", "==", username).limit(1).get();
				if (user.empty || !user.docs[0].exists || !user.docs[0].data())
					return [false, null];
				const { password, ...data } = user.docs[0].data() as DatabaseUser;
				const passwordMatches = await compare(userPassword, password);
				return [passwordMatches, passwordMatches ? data : null];
			} catch (err) {
				throw new InternalServerError({
					message: "Não foi possível validar suas credenciais.",
					errorLocationCode: "REPOS:USERS:VALIDATECREDENTIALS_FAILURE",
					stack: new Error().stack,
				});
			}
		}, this.retryOpts);
	}
}
