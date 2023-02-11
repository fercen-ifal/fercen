import { ValidationError } from "errors/index";
import { OAuth2Client } from "google-auth-library";
import { canRequest } from "middlewares/can";
import nc, { type ApiRequest } from "models/connect";
import validator from "models/validator";
import type { NextApiResponse } from "next";
import type { RequestHandler } from "next-connect";
import { usersRepository } from "repositories/index";
import { google } from "googleapis";

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

export default nc().post(canRequest("create:session"), postHandler);
