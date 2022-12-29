import { InternalServerError, ValidationError } from "errors/index";
import { canRequest } from "middlewares/can";
import nc, { type ApiRequest } from "models/connect";
import validator from "models/validator";
import type { NextApiResponse } from "next";
import type { RequestHandler } from "next-connect";
import { usersRepository } from "repositories/index";
import retry from "async-retry";
import { hash } from "bcrypt";
import { mailProvider } from "providers/index";
import { getURL } from "models/webserver";

interface PutHandlerBody {
	fullname?: string;
	email?: string;
	newPassword?: string;
	password: string;
}

const putHandler: RequestHandler<ApiRequest, NextApiResponse> = async (req, res) => {
	// Editar usuário
	const { password, newPassword, ...body } = validator<PutHandlerBody>(req.body, {
		fullname: "optional",
		email: "optional",
		newPassword: "optional",
		password: "required",
	});

	const [canLogin] = await usersRepository.validateCredentials(
		req.session.user?.type === "user" ? req.session.user.username : "",
		password
	);

	if (!canLogin) {
		throw new ValidationError({
			message: "Sua senha não confere.",
			action: "Altere seus dados e tente novamente.",
			errorLocationCode: "API:USER:PUT:CREDENTIALS_MISMATCH",
		});
	}

	let newPasswordHash = "";

	await retry(
		async () => {
			if (newPassword) {
				try {
					newPasswordHash = await hash(newPassword, 12);
				} catch (err) {
					throw new InternalServerError({
						message: "Não foi possível encriptar sua senha.",
						errorLocationCode: "API:USER:PUT:HASH_FAILURE",
					});
				}
			}
		},
		{ retries: 3, minTimeout: 100, maxTimeout: 200 }
	);

	const changes = Object.keys(JSON.parse(JSON.stringify({ ...body, newPassword })))
		.reduce((previous, current) => {
			let label = "";

			if (current === "fullname") label = "Nome completo";
			else if (current === "email") label = "Email";
			else if (current === "newPassword") label = "Senha";

			previous.push(label);
			return previous;
		}, [] as string[])
		.join(", ");

	await usersRepository.update(req.session.user?.type === "user" ? req.session.user.id : "", {
		...body,
		password: newPassword ? newPasswordHash : undefined,
	});

	await mailProvider.send(
		{
			to: req.session.user?.type === "user" ? req.session.user.email : "",
			subject: "FERCEN | Alteração de dados",
		},
		{
			template: "d-3d4f1c6727c147318328c7e26ac012d0",
			variables: {
				username: req.session.user?.type === "user" ? req.session.user.username : "",
				changes,
				// TODO: Update path according to actual page
				url: new URL("/conta", getURL()).toString(),
			},
		}
	);

	return res.status(200).json({ message: "Seu usuário foi atualizado com sucesso." });
};

export default nc().put(canRequest("update:user"), putHandler);
