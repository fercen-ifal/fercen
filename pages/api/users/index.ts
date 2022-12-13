import nc, { type ApiRequest } from "models/connect";
import type { NextApiResponse } from "next";
import type { RequestHandler } from "next-connect";

const getHandler: RequestHandler<ApiRequest, NextApiResponse> = async (req, res) => {
	// Ver todos os usuários (admin)
	return res.status(501).json({ message: "Não implementado." });
};

const postHandler: RequestHandler<ApiRequest, NextApiResponse> = async (req, res) => {
	// Criar um novo usuário (publico)
	return res.status(501).json({ message: "Não implementado." });
};

export default nc.get(getHandler).post(postHandler);
