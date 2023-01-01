import { NotFoundError, ValidationError } from "errors/index";
import { canRequest } from "middlewares/can";
import nc, { type ApiRequest } from "models/connect";
import validator from "models/validator";
import { getURL } from "models/webserver";
import type { NextApiResponse } from "next";
import type { RequestHandler } from "next-connect";
import { mailProvider } from "providers/index";
import { invitesRepository } from "repositories/index";

interface PostHandlerBody {
	email: string;
}

interface DeleteHandlerParams {
	id: string;
}

const getHandler: RequestHandler<ApiRequest, NextApiResponse> = async (req, res) => {
	// Ler todos os convites
	const invites = await invitesRepository.readAll();
	return res.status(200).json({ message: "Convites listados com sucesso.", invites });
};

const postHandler: RequestHandler<ApiRequest, NextApiResponse> = async (req, res) => {
	// Criar novo convite
	const { email } = validator<PostHandlerBody>(req.body, {
		email: "required",
	});

	const inviteAlreadyExists = await invitesRepository.readByTarget(email);
	if (inviteAlreadyExists && inviteAlreadyExists.used) {
		throw new ValidationError({
			message: "O usuário já está cadastrado no sistema.",
			action: "Altere o destinatário e tente novamente.",
			errorLocationCode: "API:INVITES:POST:INVITE_USED",
		});
	}
	if (inviteAlreadyExists && !inviteAlreadyExists.used) {
		throw new ValidationError({
			message: "O usuário já possui um convite pendente.",
			action: "Altere o destinatário e tente novamente.",
			errorLocationCode: "API:INVITES:POST:INVITE_EXISTS",
		});
	}

	const [_, invite] = await invitesRepository.create({
		targetEmail: email,
		invitedBy: {
			id: req.session.user?.type === "user" ? req.session.user.id : "",
			email: req.session.user?.type === "user" ? req.session.user.email : "",
		},
		used: false,
	});

	await mailProvider.send(
		{
			to: email,
			subject: "FERCEN | Convite para criar conta",
		},
		{
			template: "d-9705267831ad4539ab4bc81f4a8b5c40",
			variables: {
				invite,
				// TODO: Update path according to actual page
				url: new URL(`/cadastrar?invite=${invite}`, getURL()).toString(),
			},
		}
	);

	return res
		.status(200)
		.json({ message: "Convite criado e enviado ao destinatário com sucesso." });
};

const deleteHandler: RequestHandler<ApiRequest, NextApiResponse> = async (req, res) => {
	// Deletar convite
	const { id } = validator<DeleteHandlerParams>(req.query, { id: "required" });

	const wasDeleted = await invitesRepository.delete(id);
	if (!wasDeleted) {
		throw new NotFoundError({
			message: "Convite não encontrado.",
			action: "Verifique os dados enviados e tente novamente.",
			errorLocationCode: "API:INVITES:DELETE:INVITE_NOT_FOUND",
		});
	}

	return res.status(200).json({ message: "Convite deletado com sucesso." });
};

export default nc()
	.get(canRequest("read:invite"), getHandler)
	.post(canRequest("create:invite"), postHandler)
	.delete(canRequest("read:invite"), deleteHandler);
