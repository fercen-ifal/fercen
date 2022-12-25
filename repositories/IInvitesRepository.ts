import type { Invite, UpdatableInvite } from "entities/Invite";

export interface IInvitesRepository {
	create(invite: Omit<Invite, "id" | "publicId">): Promise<[string, string]>;
	read(idOrPublicId: string, isPublicId?: boolean): Promise<Invite | null>;
	readAll(): Promise<Invite[]>;
	update(
		idOrPublicId: string,
		newData: UpdatableInvite,
		isPublicId?: boolean
	): Promise<string | null>;
	delete(idOrPublicId: string, isPublicId?: boolean): Promise<string | null>;
}
