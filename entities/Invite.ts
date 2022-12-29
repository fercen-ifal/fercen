import type { User } from "./User";

/** Interface do convite.  */
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
	/** Determina se o convite foi usado ou não.  */
	used: boolean;
	/** Determina em que momento o convite foi usado.  */
	usedAt?: FirebaseFirestore.Timestamp;
}

/** Interface do convite contendo apenas dados atualizáveis. */
export interface UpdatableInvite {
	used?: boolean;
	usedAt?: FirebaseFirestore.Timestamp;
}
