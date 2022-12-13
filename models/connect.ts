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

export interface ApiRequest extends NextApiRequest {
	requestId?: string;
}

const injectRequestId: Middleware<ApiRequest, NextApiResponse> = async (req, res, next) => {
	req.requestId = uuid();

	if (next) next();
};

const nc = nextConnect<ApiRequest, NextApiResponse>({
	onError: (err, req, res) => {
		// TODO: Improve error handling (logging)

		if (
			err instanceof ValidationError ||
			err instanceof NotFoundError ||
			err instanceof ForbiddenError ||
			err instanceof UnauthorizedError
		) {
			if (err instanceof UnauthorizedError) {
				// TODO: Cleanup session cookie
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
}).use(injectRequestId);

export default nc;
