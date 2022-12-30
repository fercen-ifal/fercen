import type { User } from "./User";

/** Interface do código de recuperação.  */
export interface RecoveryCode {
	id: string;
	/** ID que o usuário informará ao sistema.  */
	publicId: string;
	/** ID do usuário que receberá as alterações.  */
	targetUserId: User["id"];
	/** Timestamp do momento em que o código de recuperação foi criado. */
	createdAt: FirebaseFirestore.Timestamp;
	/** Timestamp de até qual momento o código de recuperação será válido. */
	validUntil: FirebaseFirestore.Timestamp;
	/** Determina se o código de recuperação foi usado ou não.  */
	used: boolean;
	/** Timestamp do momento em que o código de recuperação foi usado. */
	usedAt?: FirebaseFirestore.Timestamp;
}

export interface UpdatableRecoveryCode {
	used?: RecoveryCode["used"];
	usedAt?: RecoveryCode["usedAt"];
}
