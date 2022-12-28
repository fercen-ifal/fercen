import { InternalServerError, ValidationError } from "errors/index";
import { canRequest } from "middlewares/can";
import nc, { type ApiRequest } from "models/connect";
import validator from "models/validator";
import type { NextApiResponse } from "next";
import type { RequestHandler } from "next-connect";
import { invitesRepository, usersRepository } from "repositories/index";
import { hash } from "bcrypt";
import retry from "async-retry";
import { firestore as FirebaseFirestore } from "firebase-admin";

interface PostHandlerBody {
	username: string;
	email: string;
	password: string;
	invite: string;
}

const getHandler: RequestHandler<ApiRequest, NextApiResponse> = async (req, res) => {
	// Ver todos os usuários (admin)
	const users = await usersRepository.readAll();
	return res.status(200).json({ message: "Usuários listados com sucesso.", users });
};

const postHandler: RequestHandler<ApiRequest, NextApiResponse> = async (req, res) => {
	// Criar um novo usuário (publico)
	const body = validator<PostHandlerBody>(req.body, {
		username: "required",
		email: "required",
		password: "required",
		invite: "required",
	});

	const usernameExists = await usersRepository.readByUsername(body.username);
	const emailExists = await usersRepository.read(body.email, true);

	if (usernameExists || emailExists) {
		throw new ValidationError({
			message: "O 'username' ou 'email' informado já foi registrado.",
			action: "Altere seus dados e tente novamente.",
			errorLocationCode: "API:USERS:POST:USERNAME_OR_EMAIL_EXISTS",
		});
	}

	const inviteExists = await invitesRepository.read(body.invite, true);

	if (!inviteExists || inviteExists.used) {
		throw new ValidationError({
			message: "O 'invite' informado não existe ou é inválido.",
			action: "Altere seus dados e tente novamente.",
			errorLocationCode: "API:USERS:POST:INVITE_INVALID",
		});
	}

	if (inviteExists.targetEmail !== body.email) {
		throw new ValidationError({
			message: "O 'invite' informado não pertence ao seu usuário.",
			action: "Altere seus dados e tente novamente.",
			errorLocationCode: "API:USERS:POST:INVITE_TARGET_MISMATCH",
		});
	}

	// TODO: Create a service to abstract controller operations

	let password = "";

	await retry(
		async () => {
			try {
				password = await hash(body.password, 12);
			} catch (err) {
				throw new InternalServerError({
					message: "Não foi possível encriptar sua senha.",
					errorLocationCode: "API:USERS:POST:HASH_FAILURE",
				});
			}
		},
		{ retries: 3, minTimeout: 100, maxTimeout: 200 }
	);

	await usersRepository.create({
		fullname: null,
		username: body.username,
		email: body.email,
		password,
		invite: body.invite,
		permissions: ["read:user", "read:session", "update:user"],
	});

	await invitesRepository.update(
		body.invite,
		{ used: true, usedAt: FirebaseFirestore.Timestamp.now() },
		true
	);

	return res.status(201).json({ message: "Usuário criado com sucesso.", action: "Faça login." });
};

export default nc()
	.get(canRequest("read:user:list"), getHandler)
	.post(canRequest("create:user"), postHandler);
