import { FirebaseInvitesRepository } from "./implementations/FirebaseInvitesRepository";
import { FirebaseUsersRepository } from "./implementations/FirebaseUsersRepository";

export const usersRepository = new FirebaseUsersRepository();
export const invitesRepository = new FirebaseInvitesRepository();
