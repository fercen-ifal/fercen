import retry from "async-retry";
import { hash } from "bcrypt";
import { type Permission, Permissions } from "entities/Permissions";
import { InternalServerError, ValidationError } from "errors/index";
import { canRequest } from "middlewares/can";
import nc, { type ApiRequest } from "models/connect";
import validator from "models/validator";
import { getURL } from "models/webserver";
import type { NextApiResponse } from "next";
import type { RequestHandler } from "next-connect";
import { mailProvider } from "providers/index";
import { usersRepository } from "repositories/index";

interface PutHandlerBody {
	fullname?: string;
	email?: string;
	newPassword?: string;
	password: string;
}

interface PatchHandlerBody {
	id: string;
	fullname?: string;
	email?: string;
	permissions?: string[];
}

const putHandler: RequestHandler<ApiRequest, NextApiResponse> = async (req, res) => {
	// Editar usuário
	const { password, newPassword, ...body } = validator<PutHandlerBody>(req.body, {
		fullname: "optional",
		email: "optional",
		newPassword: "optional",
		password: "required",
	});

	const [canProceed] = await usersRepository.validateCredentials(
		req.session.user?.type === "user" ? req.session.user.username : "",
		password
	);

	if (!canProceed) {
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
				url: new URL("/painel/conta", getURL()).toString(),
			},
		}
	);

	return res.status(200).json({ message: "Seu usuário foi atualizado com sucesso." });
};

const patchHandler: RequestHandler<ApiRequest, NextApiResponse> = async (req, res) => {
	// Editar outro usuário
	const { id, fullname, email, permissions } = validator<PatchHandlerBody>(req.body, {
		id: "required",
		fullname: "optional",
		email: "optional",
		permissions: "optional",
	});

	if (permissions && permissions.length > 0) {
		for (const permission of permissions) {
			if (!Object.keys(Permissions).includes(permission)) {
				throw new ValidationError({
					message: "Uma das permissões do usuário é inválida.",
					action: "Reporte o erro utilizando o 'requestId' e a permissão inválida do campo 'key'.",
					errorLocationCode: "API:USER:PATCH:INVALID_PERMISSION",
					key: permission,
				});
			}
		}
	}

	const changes = Object.keys(JSON.parse(JSON.stringify({ fullname, email, permissions })))
		.reduce((previous, current) => {
			let label = "";

			if (current === "fullname") label = "Nome completo";
			else if (current === "email") label = "Email";
			else if (current === "permissions") label = "Permissões";

			previous.push(label);
			return previous;
		}, [] as string[])
		.join(", ");

	await usersRepository.update(id, {
		fullname,
		email,
		permissions: permissions as Permission[] | undefined,
	});

	const user = await usersRepository.read(id);
	if (!user) {
		throw new InternalServerError({
			message: "Não foi possível encontrar o usuário informado.",
			action: "Verifique os dados enviados e tente novamente.",
			errorLocationCode: "API:USER:PATCH:USER_NOT_FOUND",
		});
	}

	await mailProvider.send(
		{
			to: user.email,
			subject: "FERCEN | Alteração de dados por administrador",
		},
		{
			template: "d-18767705afce47158502d28fec925c6f",
			variables: {
				username: user.fullname || user.username,
				admin:
					req.session.user?.type === "user"
						? req.session.user.fullname || req.session.user.username
						: "",
				changes,
				url: new URL("/painel/conta", getURL()).toString(),
			},
		}
	);

	return res.status(200).json({
		message: `Usuário ${user.username} alterado com sucesso.`,
		user,
	});
};

export default nc()
	.put(canRequest("update:user"), putHandler)
	.patch(canRequest("update:user:other"), patchHandler);
