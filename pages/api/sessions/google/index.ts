import { InternalServerError, ValidationError } from "errors/index";
import { firestore as FirebaseFirestore } from "firebase-admin";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import { canRequest } from "middlewares/can";
import nc, { type ApiRequest } from "models/connect";
import validator from "models/validator";
import type { NextApiResponse } from "next";
import type { RequestHandler } from "next-connect";
import { usersRepository } from "repositories/index";

interface PostHandlerBody {
	code: string;
}

const postHandler: RequestHandler<ApiRequest, NextApiResponse> = async (req, res) => {
	// Criar sessão com Google (fazer login com Google)
	const { code } = validator<PostHandlerBody>(req.body, {
		code: "required",
	});

	// TODO: Extract to GoogleOAuthProvider
	const googleOAuthProvider = new OAuth2Client(String(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID));
	googleOAuthProvider.setCredentials({ access_token: code });

	const googleOAuthApi = google.oauth2({ auth: googleOAuthProvider, version: "v2" });
	const payload = await googleOAuthApi.userinfo.get();

	if (!payload || !payload.data || !payload.data.email) {
		throw new ValidationError({
			message: "Seu código de verificação Google é inválido.",
			action: "Verifique seus dados e tente novamente.",
			errorLocationCode: "API:SESSIONS:GOOGLE:POST:EMPTY_PAYLOAD",
		});
	}

	const user = await usersRepository.readByGoogleEmail(payload.data.email);

	if (!user) {
		throw new ValidationError({
			message: "Nenhuma conta com seu email Google foi encontrada.",
			action: "Verifique se você vinculou sua conta Google com sua conta FERCEN.",
			errorLocationCode: "API:SESSIONS:GOOGLE:POST:NOT_FOUND",
		});
	}

	req.session.user = {
		type: "user",
		...user,
	};
	await req.session.save();

	return res.status(200).json({ message: "Logado com sucesso." });
};

const putHandler: RequestHandler<ApiRequest, NextApiResponse> = async (req, res) => {
	// Vincular conta Google em conta FERCEN
	const { code } = validator<PostHandlerBody>(req.body, {
		code: "required",
	});

	const user = req.session.user;
	if (!user || user.type === "anonymous") {
		throw new InternalServerError({
			errorLocationCode: "API:SESSIONS:GOOGLE:PUT:SESSION_ERROR",
		});
	}

	if (user.googleProvider && user.googleProvider.email) {
		throw new ValidationError({
			message: "Sua conta já possui um vínculo Google.",
			action: "Desfaça o vínculo para poder vincular novamente.",
			errorLocationCode: "API:SESSIONS:GOOGLE:PUT:ALREADY_SYNCED",
		});
	}

	// TODO: Extract to GoogleOAuthProvider
	const googleOAuthProvider = new OAuth2Client(String(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID));
	googleOAuthProvider.setCredentials({ access_token: code });

	const googleOAuthApi = google.oauth2({ auth: googleOAuthProvider, version: "v2" });
	const payload = await googleOAuthApi.userinfo.get();

	if (!payload || !payload.data || !payload.data.email) {
		throw new ValidationError({
			message: "Seu código de verificação Google é inválido.",
			action: "Verifique seus dados e tente novamente.",
			errorLocationCode: "API:SESSIONS:GOOGLE:PUT:EMPTY_PAYLOAD",
		});
	}

	const emailAlreadyConnected = await usersRepository.readByGoogleEmail(payload.data.email);
	if (emailAlreadyConnected) {
		throw new ValidationError({
			message: "Esta conta Google já está conectada em outra conta FERCEN.",
			action: "Verifique se você vinculou sua conta Google com outra conta FERCEN.",
			errorLocationCode: "API:SESSIONS:GOOGLE:PUT:GOOGLE_EMAIL_ALREADY_CONNECTED",
		});
	}

	await usersRepository.update(user.id, {
		googleProvider: {
			uid: payload.data.id || "",
			name: `${payload.data.given_name} ${payload.data.family_name}`,
			email: payload.data.email,
			connectedAt: FirebaseFirestore.Timestamp.now(),
		},
	});

	return res.status(200).json({ message: "Conta Google vinculada com sucesso." });
};

const deleteHandler: RequestHandler<ApiRequest, NextApiResponse> = async (req, res) => {
	// Remover vínculo de conta Google
	const user = req.session.user;
	if (!user || user.type === "anonymous") {
		throw new InternalServerError({
			errorLocationCode: "API:SESSIONS:GOOGLE:DELETE:SESSION_ERROR",
		});
	}

	if (!user.googleProvider || !user.googleProvider.email) {
		throw new ValidationError({
			message: "Sua conta não possui um vínculo Google.",
			action: "Vincule sua conta Google para poder desvinculá-la.",
			errorLocationCode: "API:SESSIONS:GOOGLE:DELETE:NOT_SYNCED",
		});
	}

	await usersRepository.update(user.id, {
		googleProvider: null,
	});

	return res.status(200).json({ message: "Conta Google desvinculada com sucesso." });
};

export default nc()
	.post(canRequest("create:session"), postHandler)
	.put(canRequest("update:user"), putHandler)
	.delete(canRequest("update:user"), deleteHandler);
