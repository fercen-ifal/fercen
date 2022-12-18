import { canRequest } from "middlewares/can";
import nc, { type ApiRequest } from "models/connect";
import validator from "models/validator";
import type { NextApiResponse } from "next";
import type { RequestHandler } from "next-connect";

interface PostHandlerBody {
	username: string;
	email: string;
	password: string;
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
	});

	return res.status(501).json({ message: "Não implementado.", body });
};

export default nc
	.get(canRequest("read:user:list"), getHandler)
	.post(canRequest("create:user"), postHandler);
