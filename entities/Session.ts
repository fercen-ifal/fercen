import type { Permission } from "./Permissions";
import type { User } from "./User";

export interface AnonymousSession {
	type: "anonymous";
	permissions: Permission[];
}

export interface UserSession extends User {
	type: "user";
}

/**
 * Interface da sessão.
 * Pode ser uma sessão anônima ou uma sessão de um usuário logado.
 *
 * @see {@link AnonymousSession} Sessão anônima.
 * @see {@link UserSession} Sessão de um usuário.
 */
export type Session = AnonymousSession | UserSession;
