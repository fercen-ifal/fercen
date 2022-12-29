import { type Permission, Permissions } from "entities/Permissions";
import { ForbiddenError, UnauthorizedError, ValidationError } from "errors/index";
import type { ApiRequest } from "models/connect";
import type { NextApiResponse } from "next";
import type { Middleware, NextHandler } from "next-connect";
import type { Session } from "entities/Session";

/**
 * Verifica se o usuário possui a permissão necessária.
 * Se a verificação der `false`, joga o erro `ForbiddenError`.
 *
 * @param {Permission} requiredPermission Permissão requerida.
 * @param {?Session} [user] Usuário em formato de sessão.
 */
export const can = (requiredPermission: Permission, user?: Session) => {
	validateUser(user);

	const authorized = user?.permissions.includes(requiredPermission);
	if (!authorized) {
		throw new ForbiddenError({ errorLocationCode: "MIDDLEWARES:CAN:FORBIDDEN" });
	}
};

/**
 * Transforma a função `can` em middleware.
 * @see {@link can}
 *
 * @param {Permission} requiredPermission Permissão requerida.
 *
 * @returns {Middleware<ApiRequest, NextApiResponse>} Middleware.
 */
export const canRequest = (
	requiredPermission: Permission
): Middleware<ApiRequest, NextApiResponse> => {
	return (req: ApiRequest, res: NextApiResponse, next: NextHandler) => {
		can(requiredPermission, req.session.user);
		next();
	};
};

/**
 * Valida o objeto do usuário.
 * Se algum parâmetro estiver inválido, joga o erro `ValidationError` ou `UnauthorizedError`.
 *
 * @param {?Session} [user] Usuário em formato de sessão.
 */
const validateUser = (user?: Session) => {
	if (!user) {
		throw new UnauthorizedError({
			errorLocationCode: "MIDDLEWARES:CAN:VALIDATION:UNAUTHORIZED",
		});
	}

	if (!user.permissions || user.permissions.length <= 0) {
		throw new ValidationError({
			message: "O usuário não tem o campo 'permissions' ou está nulo.",
			action: "Reporte o erro utilizando o 'requestId'.",
			errorLocationCode: "MIDDLEWARES:CAN:PERMISSION:NULL_OR_EMPTY",
		});
	}

	for (const permission of user.permissions) {
		if (!Object.keys(Permissions).includes(permission)) {
			throw new ValidationError({
				message: "Uma das permissões do usuário é inválida.",
				action: "Reporte o erro utilizando o 'requestId' e a permissão inválida do campo 'key'.",
				errorLocationCode: "MIDDLEWARES:CAN:PERMISSION:INVALID",
				key: permission,
			});
		}
	}
};
