import { type Permission, Permissions } from "entities/Permissions";
import { ForbiddenError, UnauthorizedError, ValidationError } from "errors/index";
import type { ApiRequest } from "models/connect";
import type { NextApiResponse } from "next";
import type { NextHandler } from "next-connect";
import type { Session } from "entities/Session";

export const can = (requiredPermission: Permission, user?: Session) => {
	validateUser(user);

	const authorized = user?.permissions.includes(requiredPermission);
	if (!authorized) {
		throw new ForbiddenError({ errorLocationCode: "MIDDLEWARES:CAN:FORBIDDEN" });
	}
};

export const canRequest = (requiredPermission: Permission) => {
	return (req: ApiRequest, res: NextApiResponse, next: NextHandler) => {
		can(requiredPermission, req.session.user);
		next();
	};
};

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
