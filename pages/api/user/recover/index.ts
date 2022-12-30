import type { User } from "entities/User";
import { InternalServerError, NotFoundError, ValidationError } from "errors/index";
import { canRequest } from "middlewares/can";
import nc, { type ApiRequest } from "models/connect";
import validator from "models/validator";
import type { NextApiResponse } from "next";
import type { RequestHandler } from "next-connect";
import { mailProvider } from "providers/index";
import { recoveryCodesRepository, usersRepository } from "repositories/index";
import { firestore as FirebaseFirestore } from "firebase-admin";
import { addMinutes, isBefore } from "date-fns";
import { hash } from "bcrypt";
import retry from "async-retry";
import { getURL } from "models/webserver";

interface GetHandlerParams {
	recoveryCode: string;
}

interface PostHandlerBody {
	username?: string;
	email?: string;
}

interface PutHandlerBody {
	recoveryCode: string;
	newPassword: string;
}

const getHandler: RequestHandler<ApiRequest, NextApiResponse> = async (req, res) => {
	// Verificar código de recuperação
	const { recoveryCode } = validator<GetHandlerParams>(req.query, {
		recoveryCode: "required",
	});

	const codeData = await recoveryCodesRepository.read(recoveryCode, true);
	if (!codeData) {
		throw new NotFoundError({
			message: "O código de recuperação não foi encontrado.",
			action: "Verifique os dados enviados e tente novamente.",
			errorLocationCode: "API:USER:RECOVER:GET:RECOVERY_CODE_NOT_FOUND",
		});
	}

	const valid = isBefore(
		FirebaseFirestore.Timestamp.now().toDate(),
		codeData.validUntil.toDate()
	);

	return res
		.status(200)
		.json({ message: "Código de recuperação verificado com sucesso.", valid });
};

const postHandler: RequestHandler<ApiRequest, NextApiResponse> = async (req, res) => {
	// Criar pedido de recuperação de senha
	const { username, email } = validator<PostHandlerBody>(req.body, {
		username: "optional",
		email: "optional",
	});

	let user: User;

	if (username) {
		const userByUsername = await usersRepository.readByUsername(username);

		if (!userByUsername) {
			throw new NotFoundError({
				message: "O usuário informado não foi encontrado.",
				action: "Verifique os dados informados e tente novamente.",
				errorLocationCode: "API:USER:RECOVER:POST:USERNAME_NOT_FOUND",
			});
		}

		user = userByUsername;
	} else if (email) {
		const userByEmail = await usersRepository.read(email, true);

		if (!userByEmail) {
			throw new NotFoundError({
				message: "O usuário informado não foi encontrado.",
				action: "Verifique os dados informados e tente novamente.",
				errorLocationCode: "API:USER:RECOVER:POST:EMAIL_NOT_FOUND",
			});
		}

		user = userByEmail;
	} else {
		throw new ValidationError({
			message: "Informe um usuário ou email",
			errorLocationCode: "API:USER:RECOVER:POST:VALIDATION_ERROR",
		});
	}

	const [_, recoveryCode] = await recoveryCodesRepository.create({
		targetUserId: user.id,
		createdAt: FirebaseFirestore.Timestamp.now(),
		// Adds 15 minutes based on Firestore Timestamp and then transforms it back
		validUntil: FirebaseFirestore.Timestamp.fromDate(
			addMinutes(FirebaseFirestore.Timestamp.now().toDate(), 15)
		),
		used: false,
	});

	await mailProvider.send(
		{
			to: user.email,
			subject: "FERCEN | Recuperação de senha",
		},
		{
			template: "d-dd10c9a3cda246cd9f8336e5dac841ff",
			variables: {
				name: user.fullname?.split(" ")[0] || user.username,
				code: recoveryCode,
			},
		}
	);

	return res.status(200).json({ message: "Código de recuperação enviado com sucesso." });
};

const putHandler: RequestHandler<ApiRequest, NextApiResponse> = async (req, res) => {
	// Alterar senha com código de recuperação.
	const { recoveryCode, newPassword } = validator<PutHandlerBody>(req.body, {
		recoveryCode: "required",
		newPassword: "required",
	});

	const codeData = await recoveryCodesRepository.read(recoveryCode, true);
	if (!codeData) {
		throw new NotFoundError({
			message: "O código de recuperação não foi encontrado.",
			action: "Verifique os dados enviados e tente novamente.",
			errorLocationCode: "API:USER:RECOVER:PUT:RECOVERY_CODE_NOT_FOUND",
		});
	}

	const valid = isBefore(
		FirebaseFirestore.Timestamp.now().toDate(),
		codeData.validUntil.toDate()
	);

	if (!valid || codeData.used) {
		throw new ValidationError({
			message: "O código de recuperação expirou ou é inválido.",
			action: "Verifique os dados enviados ou tente novamente.",
			errorLocationCode: "API:USER:RECOVER:PUT:RECOVERY_CODE_EXPIRED",
		});
	}

	let password = "";

	await retry(
		async () => {
			try {
				password = await hash(newPassword, 12);
			} catch (err) {
				throw new InternalServerError({
					message: "Não foi possível encriptar sua senha.",
					errorLocationCode: "API:USER:RECOVER:PUT:HASH_FAILURE",
				});
			}
		},
		{ retries: 3, minTimeout: 100, maxTimeout: 200 }
	);

	await usersRepository.update(codeData.targetUserId, { password });

	await recoveryCodesRepository.update(codeData.id, {
		used: true,
		usedAt: FirebaseFirestore.Timestamp.now(),
	});

	const user = await usersRepository.read(codeData.targetUserId);
	if (!user) {
		throw new InternalServerError({
			message: "Não foi possível encontrar o usuário.",
			errorLocationCode: "API:USER:RECOVER:PUT:USER_NOT_FOUND",
		});
	}

	await mailProvider.send(
		{
			to: user.email,
			subject: "FERCEN | Alteração de dados",
		},
		{
			template: "d-3d4f1c6727c147318328c7e26ac012d0",
			variables: {
				username: user.fullname?.split(" ")[0] || user.username,
				changes: "Recuperação de senha",
				// TODO: Update path according to actual page
				url: new URL("/conta", getURL()).toString(),
			},
		}
	);

	return res.status(200).json({ message: "Sua senha foi recuperada com sucesso." });
};

export default nc()
	.get(canRequest("create:user"), getHandler)
	.post(canRequest("create:user"), postHandler)
	.put(canRequest("create:user"), putHandler);
