import { AnonymousUserPermissions } from "entities/Permissions";
import {
	type BaseErrorParams,
	ForbiddenError,
	NotFoundError,
	ValidationError,
	UnauthorizedError,
	InternalServerError,
} from "errors";
import type { NextApiRequest, NextApiResponse } from "next";
import nextConnect, { type Middleware } from "next-connect";
import { v4 as uuid } from "uuid";
import { ironSession } from "iron-session/express";
import { sessionOptions } from "./session";
import { usersRepository } from "providers/index";

export interface ApiRequest extends NextApiRequest {
	requestId?: string;
}

const injectRequestMetadata: Middleware<ApiRequest, NextApiResponse> = async (req, res, next) => {
	req.requestId = uuid();
	res.setHeader("X-Request-Id", req.requestId);

	if (!req.session.user) {
		req.session.user = { type: "anonymous", permissions: [...AnonymousUserPermissions] };
	}

	// ! Review this method (refreshing user info at every request)
	if (req.session.user.type === "user") {
		const user = await usersRepository.read(req.session.user.id);
		if (user) {
			req.session.user = {
				type: "user",
				...user,
			};
			await req.session.save();
		}
	}

	if (next) next();
};

const nc = () => {
	return nextConnect<ApiRequest, NextApiResponse>({
		onError: (err, req, res) => {
			// TODO: Improve error handling (logging)

			if (
				err instanceof ValidationError ||
				err instanceof NotFoundError ||
				err instanceof ForbiddenError ||
				err instanceof UnauthorizedError
			) {
				if (err instanceof UnauthorizedError) {
					req.session.destroy();
				}

				const error: BaseErrorParams = { ...err, requestId: req.requestId || uuid() };
				return res.status(error.statusCode || 500).json(error);
			}

			const publicError = new InternalServerError({
				requestId: req.requestId,
				statusCode: err.statusCode,
				errorLocationCode: err.errorLocationCode,
			});

			const privateError: BaseErrorParams = {
				...publicError,
				stack: err.stack || new Error().stack,
			};
			console.log(privateError);

			return res.status(publicError.statusCode).json(publicError);
		},
		onNoMatch: (req, res) => {
			// TODO: Improve error handling (logging)
			const error = new NotFoundError({ requestId: req.requestId });
			console.log(error);
			return res.status(error.statusCode).json(error);
		},
		attachParams: true,
	})
		.use(ironSession(sessionOptions))
		.use(injectRequestMetadata);
};

export default nc;
