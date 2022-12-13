import { v4 as uuid } from "uuid";

export interface BaseErrorParams {
	message?: string;
	action?: string;
	statusCode?: number;
	errorLocationCode?: string;
	stack?: string;
	requestId?: string;
	key?: string;
	type?: string;
}

class BaseError extends Error {
	action: string;
	statusCode: number;
	requestId: string;
	errorLocationCode?: string;
	key?: string;
	type?: string;

	constructor({
		message,
		stack,
		action,
		statusCode,
		requestId,
		errorLocationCode,
		key,
		type,
	}: BaseErrorParams) {
		super();
		this.name = this.constructor.name;
		this.message = message || "Houve um erro inesperado.";
		this.stack = stack;
		this.action = action || "Tente novamente ou reporte o erro utilizando o 'requestId'.";
		this.statusCode = statusCode || 500;
		this.requestId = requestId || uuid();
		this.errorLocationCode = errorLocationCode;
		this.key = key;
		this.type = type;
	}
}

export class InternalServerError extends BaseError {
	constructor({
		message,
		stack,
		action,
		statusCode,
		requestId,
		errorLocationCode,
	}: BaseErrorParams) {
		super({
			message: message || "Houve um erro inesperado.",
			stack,
			action: action || "Tente novamente ou reporte o erro utilizando o 'requestId'.",
			statusCode: statusCode || 500,
			requestId: requestId || uuid(),
			errorLocationCode,
		});
	}
}

export class NotFoundError extends BaseError {
	constructor({ message, stack, action, requestId, errorLocationCode, key }: BaseErrorParams) {
		super({
			message: message || "O recurso solicitado não foi encontrado.",
			stack,
			action: action || "Verifique o caminho e o método do pedido e tente novamente.",
			statusCode: 404,
			requestId: requestId || uuid(),
			errorLocationCode,
			key,
		});
	}
}

export class ValidationError extends BaseError {
	constructor({
		message,
		stack,
		action,
		statusCode,
		requestId,
		errorLocationCode,
		key,
		type,
	}: BaseErrorParams) {
		super({
			message: message || "Houve um erro de validação.",
			stack,
			action: action || "Verifique os dados enviados e tente novamente.",
			statusCode: statusCode || 400,
			requestId: requestId || uuid(),
			errorLocationCode,
			key,
			type,
		});
	}
}

export class UnauthorizedError extends BaseError {
	constructor({ message, stack, action, requestId, errorLocationCode }: BaseErrorParams) {
		super({
			message: message || "Usuário não autenticado.",
			stack,
			action: action || "Verifique seu está autenticado e tente novamente.",
			statusCode: 401,
			requestId: requestId || uuid(),
			errorLocationCode,
		});
	}
}

export class ForbiddenError extends BaseError {
	constructor({ message, stack, action, requestId, errorLocationCode }: BaseErrorParams) {
		super({
			message: message || "Você não tem permissão para executar esta ação.",
			stack,
			action: action || "Verifique suas permissões e tente novamente.",
			statusCode: 403,
			requestId: requestId || uuid(),
			errorLocationCode,
		});
	}
}
