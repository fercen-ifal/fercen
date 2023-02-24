import { ValidationError } from "errors/index";
import { canRequest } from "middlewares/can";
import nc, { type ApiRequest } from "models/connect";
import validator from "models/validator";
import type { NextApiResponse } from "next";
import type { RequestHandler } from "next-connect";
import { usersRepository } from "repositories/index";

interface PostHandlerBody {
	username: string;
	password: string;
}

const getHandler: RequestHandler<ApiRequest, NextApiResponse> = async (req, res) => {
	// Ler sessão
	return res.status(200).json({ message: "Sessão lida com sucesso.", session: req.session.user });
};

const postHandler: RequestHandler<ApiRequest, NextApiResponse> = async (req, res) => {
	// Criar sessão (fazer login)
	const { username, password } = validator<PostHandlerBody>(req.body, {
		username: "required",
		password: "required",
	});

	const [canLogin, user] = await usersRepository.validateCredentials(username, password);

	if (!canLogin || !user) {
		throw new ValidationError({
			message: "Seu usuário ou senha não conferem.",
			action: "Altere seus dados e tente novamente.",
			errorLocationCode: "API:SESSIONS:POST:CREDENTIALS_MISMATCH",
		});
	}

	req.session.user = {
		type: "user",
		...user,
	};
	await req.session.save();

	return res.status(200).json({ message: "Logado com sucesso." });
};

const deleteHandler: RequestHandler<ApiRequest, NextApiResponse> = async (req, res) => {
	// Encerrar sessão
	req.session.destroy();
	return res.status(200).json({ message: "Sessão encerrada com sucesso." });
};

export default nc()
	.get(canRequest("read:session"), getHandler)
	.post(canRequest("create:session"), postHandler)
	.delete(canRequest("read:session"), deleteHandler);
