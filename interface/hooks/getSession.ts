import { cookies } from "next/headers";
import { getURL } from "models/webserver";
import type { UserSession } from "entities/Session";
import { ForbiddenError, InternalServerError } from "errors/index";
import { redirect } from "next/navigation";
import { fetcher } from "interface/utils/fetcher";

export interface GetSessionParams {
	redirect?: string;
	redirectIfFound?: boolean;
}

export interface GetSessionReturn {
	forbidden: boolean;
	session?: UserSession;
	error?: InternalServerError | ForbiddenError | unknown;
}

interface SessionsApiData {
	message: string;
	session: UserSession;
}

export const getSession = async (params?: GetSessionParams): Promise<GetSessionReturn | never> => {
	const cookie = cookies().get("fercen-session");

	if (!cookie) {
		if (params?.redirect && !params?.redirectIfFound) {
			return redirect(params.redirect);
		}

		return { forbidden: true };
	}

	const { data, error } = await fetcher<SessionsApiData>(
		new URL("/api/sessions", getURL()),
		undefined,
		{
			credentials: "same-origin",
			headers: {
				cookie: `${cookie.name}=${cookie.value}`,
			},
			// Não guarda as informações do usuário em cache para sempre receber as mais atuais.
			cache: "no-store",
		}
	);

	if (!data) {
		if (params?.redirect && !params?.redirectIfFound) {
			return redirect(params.redirect);
		}

		return {
			forbidden: true,
			error:
				error.statusCode === 403
					? new ForbiddenError(error)
					: new InternalServerError(error),
		};
	}

	if (params?.redirect && params.redirectIfFound) {
		return redirect(params.redirect);
	}

	return { forbidden: false, session: data.session };
};
