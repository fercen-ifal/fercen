import type { DatabaseUser, UpdatableUser, User } from "entities/User";

export interface IUsersRepository {
	create(user: Omit<DatabaseUser, "id">): Promise<string>;
	read(userIdOrEmail: string, isEmail?: boolean): Promise<User | null>;
	readAll(): Promise<User[]>;
	readByUsername(username: string): Promise<User | null>;
	update(
		userIdOrEmail: string,
		newData: UpdatableUser,
		isEmail?: boolean
	): Promise<string | null>;
	delete(userIdOrEmail: string, isEmail?: boolean): Promise<string | null>;
}
