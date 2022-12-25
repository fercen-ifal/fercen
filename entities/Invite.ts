import type { User } from "./User";

export interface Invite {
	id: string;
	/** ID que o usuário informará ao sistema. */
	publicId: string;
	/** Email do usuário convidado. */
	targetEmail: string;
	/** Dados de quem convidou o usuário. */
	invitedBy: {
		id: User["id"];
		email: User["email"];
	};
	used: boolean;
	usedAt?: FirebaseFirestore.Timestamp;
}

export interface UpdatableInvite {
	used?: boolean;
	usedAt?: FirebaseFirestore.Timestamp;
}
