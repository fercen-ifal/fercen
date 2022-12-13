import type { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

export default nextConnect<NextApiRequest, NextApiResponse>({
	onError: (err, req, res, next) => {
		// TODO: Improve error handling (logging and custom error objects)
		return res.status(500).json({ message: err.message ?? "Houve um erro inesperado." });
	},
})
	.get((req, res) => {
		// Ver todos os usuários (admin)
		return res.status(501).json({ message: "Não implementado." });
	})
	.post((req, res) => {
		// Criar um novo usuário (publico)
		return res.status(501).json({ message: "Não implementado." });
	});
