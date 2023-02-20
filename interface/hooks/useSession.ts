"use client";

import type { UserSession } from "entities/Session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR, { type KeyedMutator } from "swr";

interface SessionsApiData {
	message: string;
	session?: UserSession;
}

export interface UseSessionReturn {
	session?: UserSession;
	mutate: KeyedMutator<SessionsApiData>;
	isLoading: boolean;
	error?: any;
}

const fetcher = (url: string) => fetch(url).then(data => data.json());

export const useSession = (
	redirect?: string | URL,
	redirectIfFound?: boolean
): UseSessionReturn => {
	const { push } = useRouter();
	const { data, mutate, isLoading, error } = useSWR<SessionsApiData>("/api/sessions", fetcher);
	const session = data?.session;

	useEffect(() => {
		if (isLoading) return;
		if (
			(redirect && !redirectIfFound && !session) ||
			(redirect && redirectIfFound && session)
		) {
			push(typeof redirect === "string" ? redirect : redirect.toString());
		}
	}, [isLoading, session, redirect, redirectIfFound, push, data, error]);

	return { session, mutate, isLoading, error };
};
