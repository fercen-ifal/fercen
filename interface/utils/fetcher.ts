import type { BaseErrorParams } from "errors/index";

export interface FetcherErrorReturn {
	error: BaseErrorParams;
	data?: undefined;
}

export interface FetcherSuccessReturn<ReturnType> {
	error?: undefined;
	data: ReturnType;
}

export type FetcherReturn<ReturnType> = FetcherErrorReturn | FetcherSuccessReturn<ReturnType>;

export const fetcher = async <ReturnType = Object, BodyType = Object>(
	url: string | URL,
	body?: BodyType,
	init?: Omit<RequestInit, "body">
): Promise<FetcherReturn<ReturnType>> => {
	const res = await fetch(url, {
		...init,
		method: init?.method ? init.method : body ? "POST" : "GET",
		headers: {
			...init?.headers,
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: body ? JSON.stringify(body) : null,
	});
	const data: ReturnType | BaseErrorParams = await res.json();

	if (!res.ok) {
		return { error: data as BaseErrorParams };
	}

	return { data: data as ReturnType };
};
