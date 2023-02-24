import { FirebaseElectricityRepository } from "./implementations/FirebaseElectricityRepository";
import { FirebaseInvitesRepository } from "./implementations/FirebaseInvitesRepository";
import { FirebaseRecoveryCodesRepository } from "./implementations/FirebaseRecoveryCodesRepository";
import { FirebaseUsersRepository } from "./implementations/FirebaseUsersRepository";

export const usersRepository = new FirebaseUsersRepository();
export const invitesRepository = new FirebaseInvitesRepository();
export const recoveryCodesRepository = new FirebaseRecoveryCodesRepository();
export const electricityRepository = new FirebaseElectricityRepository();
