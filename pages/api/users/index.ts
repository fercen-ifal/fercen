import { InternalServerError, ValidationError } from "errors/index";
import { canRequest } from "middlewares/can";
import nc, { type ApiRequest } from "models/connect";
import validator from "models/validator";
import type { NextApiResponse } from "next";
import type { RequestHandler } from "next-connect";
import { usersRepository } from "providers/index";
import { hash } from "bcrypt";
import { AnonymousUserPermissions } from "entities/Permissions";
import retry from "async-retry";

interface PostHandlerBody {
	username: string;
	email: string;
	password: string;
	invite: string;
}

const getHandler: RequestHandler<ApiRequest, NextApiResponse> = async (req, res) => {
	// Ver todos os usuários (admin)
	return res.status(501).json({ message: "Não implementado." });
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

	// TODO: Implement invite verification
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
		permissions: [...AnonymousUserPermissions, "read:user", "read:session", "update:user"],
	});

	return res.status(201).json({ message: "Usuário criado com sucesso.", action: "Faça login." });
};

export default nc
	.get(canRequest("read:user:list"), getHandler)
	.post(canRequest("create:user"), postHandler);
